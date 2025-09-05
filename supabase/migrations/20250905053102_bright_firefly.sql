/*
  # Create initial Game Arena schema

  1. New Tables
    - `profiles` - User profiles with gaming information
    - `match_requests` - Requests sent between players for matches  
    - `vs_matches` - V/S arena matches (9 PM - 12 AM)
    - `tournaments` - Tournament information and details
    - `tournament_registrations` - User tournament registrations
    - `notifications` - User notifications system
    - `contact_messages` - Contact form submissions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Admin policies for tournament and notification management

  3. Features
    - User authentication with Supabase Auth
    - Match request system between players
    - Time-restricted V/S matches
    - Tournament registration system
    - Notification system for updates
    - Contact form for user feedback
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  game_uid text UNIQUE NOT NULL,
  level integer NOT NULL CHECK (level >= 1 AND level <= 100),
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  active_time time NOT NULL DEFAULT '18:00',
  profile_photo text,
  tokens integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create match_requests table
CREATE TABLE IF NOT EXISTS match_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_type text NOT NULL DEFAULT 'TDM',
  available_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_request CHECK (sender_id != receiver_id)
);

-- Create vs_matches table
CREATE TABLE IF NOT EXISTS vs_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_type text NOT NULL CHECK (match_type IN ('1v1', '2v2', '4v4')),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'completed', 'timeout')),
  room_id text,
  room_password text,
  opponent_id uuid REFERENCES profiles(id),
  result text CHECK (result IN ('won', 'lost', 'draw')),
  tokens_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  entry_fee numeric DEFAULT 0,
  prize_pool numeric NOT NULL DEFAULT 0,
  max_participants integer NOT NULL DEFAULT 100,
  current_participants integer DEFAULT 0,
  start_time timestamptz NOT NULL,
  registration_deadline timestamptz NOT NULL,
  rules text NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tournament_registrations table
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_name text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('match', 'tournament', 'tokens', 'general')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vs_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Match requests policies
CREATE POLICY "Users can view own requests" ON match_requests FOR SELECT TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send requests" ON match_requests FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update received requests" ON match_requests FOR UPDATE TO authenticated 
  USING (auth.uid() = receiver_id);

-- VS matches policies
CREATE POLICY "Users can view own matches" ON vs_matches FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own matches" ON vs_matches FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own matches" ON vs_matches FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- Tournaments policies (public read, admin write)
CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT TO authenticated USING (true);

-- Tournament registrations policies
CREATE POLICY "Users can view own registrations" ON tournament_registrations FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can register for tournaments" ON tournament_registrations FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- Contact messages policies (insert only for users)
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_match_requests_receiver ON match_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_sender ON match_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests(status);
CREATE INDEX IF NOT EXISTS idx_vs_matches_user ON vs_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_vs_matches_status ON vs_matches(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create function to increment tournament participants
CREATE OR REPLACE FUNCTION increment_tournament_participants(tournament_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  UPDATE tournaments 
  SET current_participants = current_participants + 1 
  WHERE id = tournament_id;
END;
$$;

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER match_requests_updated_at 
  BEFORE UPDATE ON match_requests 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER vs_matches_updated_at 
  BEFORE UPDATE ON vs_matches 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER tournaments_updated_at 
  BEFORE UPDATE ON tournaments 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample tournaments
INSERT INTO tournaments (
  title, description, image_url, entry_fee, prize_pool, max_participants, 
  start_time, registration_deadline, rules
) VALUES 
(
  'BGMI Championship 2024',
  'The ultimate BGMI tournament featuring the best players from around the world. Compete in classic mode matches across multiple maps with exciting cash prizes.',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
  0,
  50000,
  128,
  now() + interval '7 days',
  now() + interval '5 days',
  '1. All matches will be played in TPP mode
2. Each team must have 4 players
3. No cheating or hacking allowed
4. Respect all players and admins
5. Follow official BGMI rules and regulations'
),
(
  'Weekly TDM Battle',
  'Fast-paced Team Deathmatch tournament for quick action and intense competition. Perfect for players who love aggressive gameplay.',
  'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
  25,
  2500,
  64,
  now() + interval '3 days',
  now() + interval '2 days',
  '1. TDM mode only
2. Best of 3 rounds
3. No camping allowed
4. Standard weapon restrictions apply
5. Tournament bracket format'
),
(
  'Solo Showdown',
  'Individual skill tournament where only the best solo players survive. Test your individual combat skills in this intense competition.',
  'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
  10,
  1000,
  32,
  now() + interval '10 days',
  now() + interval '8 days',
  '1. Solo players only
2. Classic mode - Erangel
3. 3 matches total
4. Points system based on kills and placement
5. Top 8 advance to finals'
);

-- Insert sample notifications for demo
DO $$
DECLARE
    sample_user_id uuid;
BEGIN
    -- This will only work if there are users in the system
    SELECT id INTO sample_user_id FROM profiles LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type) VALUES
        (sample_user_id, 'Welcome to Game Arena!', 'Your account has been created successfully. Start by exploring players and joining matches.', 'general'),
        (sample_user_id, 'Tournament Opening Soon', 'BGMI Championship 2024 registration is now open! Don''t miss your chance to compete.', 'tournament'),
        (sample_user_id, 'Tokens Earned', 'You have earned 50 tokens for completing your first match. Keep playing to earn more!', 'tokens');
    END IF;
END $$;