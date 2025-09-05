import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          game_uid: string;
          level: number;
          phone: string;
          email: string;
          active_time: string;
          profile_photo?: string;
          tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          game_uid: string;
          level: number;
          phone: string;
          email: string;
          active_time: string;
          profile_photo?: string;
          tokens?: number;
        };
        Update: {
          username?: string;
          game_uid?: string;
          level?: number;
          phone?: string;
          active_time?: string;
          profile_photo?: string;
          tokens?: number;
        };
      };
      match_requests: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          match_type: string;
          available_time: string;
          status: 'pending' | 'accepted' | 'rejected';
          rejection_reason?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          sender_id: string;
          receiver_id: string;
          match_type: string;
          available_time: string;
          status?: 'pending' | 'accepted' | 'rejected';
          rejection_reason?: string;
        };
        Update: {
          status?: 'pending' | 'accepted' | 'rejected';
          rejection_reason?: string;
        };
      };
      vs_matches: {
        Row: {
          id: string;
          user_id: string;
          match_type: '1v1' | '2v2' | '4v4';
          status: 'waiting' | 'matched' | 'completed' | 'timeout';
          room_id?: string;
          room_password?: string;
          opponent_id?: string;
          result?: 'won' | 'lost' | 'draw';
          tokens_earned?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          match_type: '1v1' | '2v2' | '4v4';
          status?: 'waiting' | 'matched' | 'completed' | 'timeout';
          room_id?: string;
          room_password?: string;
          opponent_id?: string;
          result?: 'won' | 'lost' | 'draw';
          tokens_earned?: number;
        };
        Update: {
          status?: 'waiting' | 'matched' | 'completed' | 'timeout';
          room_id?: string;
          room_password?: string;
          opponent_id?: string;
          result?: 'won' | 'lost' | 'draw';
          tokens_earned?: number;
        };
      };
      tournaments: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          entry_fee: number;
          prize_pool: number;
          max_participants: number;
          current_participants: number;
          start_time: string;
          registration_deadline: string;
          rules: string;
          status: 'upcoming' | 'ongoing' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          image_url: string;
          entry_fee: number;
          prize_pool: number;
          max_participants: number;
          current_participants?: number;
          start_time: string;
          registration_deadline: string;
          rules: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
        };
        Update: {
          title?: string;
          description?: string;
          image_url?: string;
          entry_fee?: number;
          prize_pool?: number;
          max_participants?: number;
          current_participants?: number;
          start_time?: string;
          registration_deadline?: string;
          rules?: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
        };
      };
      tournament_registrations: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          team_name?: string;
          created_at: string;
        };
        Insert: {
          tournament_id: string;
          user_id: string;
          team_name?: string;
        };
        Update: {
          team_name?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'match' | 'tournament' | 'tokens' | 'general';
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          message: string;
          type: 'match' | 'tournament' | 'tokens' | 'general';
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          status: 'pending' | 'replied';
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          message: string;
          status?: 'pending' | 'replied';
        };
        Update: {
          status?: 'pending' | 'replied';
        };
      };
    };
  };
};