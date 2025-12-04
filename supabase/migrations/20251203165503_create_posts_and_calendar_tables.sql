/*
  # LinkedIn Post Generator Schema

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `user_id` (uuid) - User who created the post (for future auth)
      - `content` (text) - The generated post content
      - `type` (text) - Type of post: 'long', 'short', or 'carousel'
      - `theme` (text) - The theme/topic of the post
      - `created_at` (timestamptz) - When the post was created
      - `updated_at` (timestamptz) - When the post was last modified
      - `is_favorite` (boolean) - Whether the post is marked as favorite
    
    - `calendar_ideas`
      - `id` (uuid, primary key) - Unique identifier for each idea
      - `user_id` (uuid) - User who created the idea (for future auth)
      - `title` (text) - Title of the content idea
      - `description` (text) - Detailed description of the idea
      - `scheduled_date` (date) - Suggested date for posting
      - `status` (text) - Status: 'pending', 'completed', 'archived'
      - `category` (text) - Category/theme of the idea
      - `created_at` (timestamptz) - When the idea was created
      - `updated_at` (timestamptz) - When the idea was last modified
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users (prepared for future auth)
    - For now, allow all operations for development
*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('long', 'short', 'carousel')),
  theme text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_favorite boolean DEFAULT false
);

-- Create calendar_ideas table
CREATE TABLE IF NOT EXISTS calendar_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  description text,
  scheduled_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'archived')),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_ideas ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_type_idx ON posts(type);
CREATE INDEX IF NOT EXISTS calendar_ideas_scheduled_date_idx ON calendar_ideas(scheduled_date);
CREATE INDEX IF NOT EXISTS calendar_ideas_status_idx ON calendar_ideas(status);

-- RLS Policies (permissive for development, can be restricted later with auth)
CREATE POLICY "Allow all operations on posts for now"
  ON posts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on calendar_ideas for now"
  ON calendar_ideas FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_ideas_updated_at
  BEFORE UPDATE ON calendar_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();