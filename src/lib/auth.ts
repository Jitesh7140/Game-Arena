import { supabase } from './supabase';
import toast from 'react-hot-toast';

export const signUp = async (userData: {
  email: string;
  password: string;
  username: string;
  gameUid: string;
  level: number;
  phone: string;
  activeTime: string;
}) => {
  try {
    // First, check if username or game UID already exists
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('username, game_uid')
      .or(`username.eq.${userData.username},game_uid.eq.${userData.gameUid}`);

    if (existingProfiles && existingProfiles.length > 0) {
      const existing = existingProfiles[0];
      if (existing.username === userData.username) {
        throw new Error('Username already exists');
      }
      if (existing.game_uid === userData.gameUid) {
        throw new Error('Game UID already exists');
      }
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: userData.username,
          game_uid: userData.gameUid,
          level: userData.level,
          phone: userData.phone,
          email: userData.email,
          active_time: userData.activeTime,
          tokens: 100, // Starting tokens
        });

      if (profileError) throw profileError;

      return { data, error: null };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('Error signing out');
  } else {
    toast.success('Signed out successfully');
  }
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};