import { supabase } from './supabase'; 
import toast from 'react-hot-toast';

export const getAllPlayers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

export const searchPlayers = async (query: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,game_uid.ilike.%${query}%,level.eq.${parseInt(query) || 0}`)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const sendMatchRequest = async (receiverId: string, matchType: string, availableTime: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('match_requests')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      match_type: matchType,
      available_time: availableTime,
    });

  if (!error) {
    // Send notification to receiver
    await supabase
      .from('notifications')
      .insert({
        user_id: receiverId,
        title: 'New Match Request',
        message: `You have received a new ${matchType} match request`,
        type: 'match',
      });
  }

  return { data, error };
};

export const getMyRequests = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('match_requests')
    .select(`
      *,
      sender:profiles!match_requests_sender_id_fkey(username, game_uid, level, profile_photo),
      receiver:profiles!match_requests_receiver_id_fkey(username, game_uid, level, profile_photo)
    `)
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected', reason?: string) => {
  const { data, error } = await supabase
    .from('match_requests')
    .update({
      status,
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select();

  return { data, error };
};

export const createVSMatch = async (matchType: '1v1' | '2v2' | '4v4') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if current time is between 9 PM and 12 AM
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 21 || hour >= 24) {
    throw new Error('V/S matches are only available between 9 PM - 12 AM');
  }

  // Check if user already has an active VS match
  const { data: existingMatch } = await supabase
    .from('vs_matches')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['waiting', 'matched'])
    .single();

  if (existingMatch) {
    throw new Error('You already have an active match');
  }

  // Create new match
  const { data, error } = await supabase
    .from('vs_matches')
    .insert({
      user_id: user.id,
      match_type: matchType,
      status: 'waiting',
    })
    .select()
    .single();

  if (error) throw error;

  // Try to find opponent
  setTimeout(async () => {
    await findOpponent(data.id, matchType);
  }, 1000);

  return { data, error: null };
};

const findOpponent = async (matchId: string, matchType: '1v1' | '2v2' | '4v4') => {
  // Look for another waiting match of the same type
  const { data: waitingMatches } = await supabase
    .from('vs_matches')
    .select('*')
    .eq('match_type', matchType)
    .eq('status', 'waiting')
    .neq('id', matchId)
    .limit(1);

  if (waitingMatches && waitingMatches.length > 0) {
    const opponentMatch = waitingMatches[0];
    
    // Generate room details (in real app, this would come from admin)
    const roomId = `ROOM_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const roomPassword = Math.random().toString(36).substr(2, 6);

    // Update both matches
    await supabase
      .from('vs_matches')
      .update({
        status: 'matched',
        opponent_id: opponentMatch.user_id,
        room_id: roomId,
        room_password: roomPassword,
      })
      .eq('id', matchId);

    await supabase
      .from('vs_matches')
      .update({
        status: 'matched',
        opponent_id: matchId,
        room_id: roomId,
        room_password: roomPassword,
      })
      .eq('id', opponentMatch.id);

    // Send notifications
    await Promise.all([
      supabase.from('notifications').insert({
        user_id: matchId,
        title: 'Match Found!',
        message: `${matchType} match found! Room ID: ${roomId}`,
        type: 'match',
      }),
      supabase.from('notifications').insert({
        user_id: opponentMatch.user_id,
        title: 'Match Found!',
        message: `${matchType} match found! Room ID: ${roomId}`,
        type: 'match',
      }),
    ]);
  } else {
    // Set timeout after 1 minute
    setTimeout(async () => {
      const { data: currentMatch } = await supabase
        .from('vs_matches')
        .select('status')
        .eq('id', matchId)
        .single();

      if (currentMatch && currentMatch.status === 'waiting') {
        await supabase
          .from('vs_matches')
          .update({ status: 'timeout' })
          .eq('id', matchId);
      }
    }, 60000);
  }
};

export const getMyMatches = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: requests, error: reqError } = await supabase
    .from('match_requests')
    .select(`
      *,
      sender:profiles!match_requests_sender_id_fkey(username, game_uid, level),
      receiver:profiles!match_requests_receiver_id_fkey(username, game_uid, level)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const { data: vsMatches, error: vsError } = await supabase
    .from('vs_matches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return {
    requests: requests || [],
    vsMatches: vsMatches || [],
    error: reqError || vsError,
  };
};

export const getTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('start_time', { ascending: true });

  return { data, error };
};

export const registerForTournament = async (tournamentId: string, teamName?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if already registered
  const { data: existing } = await supabase
    .from('tournament_registrations')
    .select('id')
    .eq('tournament_id', tournamentId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    throw new Error('Already registered for this tournament');
  }

  const { data, error } = await supabase
    .from('tournament_registrations')
    .insert({
      tournament_id: tournamentId,
      user_id: user.id,
      team_name: teamName,
    });

  if (!error) {
    // Update participant count
    await supabase.rpc('increment_tournament_participants', {
      tournament_id: tournamentId,
    });
  }

  return { data, error };
};

export const getNotifications = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  return { data, error };
};

export const submitContactForm = async (name: string, email: string, message: string) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      message,
    });

  if (!error) {
    toast.success('Message sent successfully! We will get back to you soon.');
  } else {
    toast.error('Failed to send message. Please try again.');
  }

  return { data, error };
};