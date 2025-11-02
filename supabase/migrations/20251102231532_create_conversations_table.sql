/*
  # Create IDE3 Conversations Storage

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique message ID
      - `session_id` (text) - Groups messages into conversations
      - `role` (text) - 'user' or 'assistant' or 'system'
      - `content` (text) - Message content (supports large context)
      - `created_at` (timestamptz) - When message was created
      - `metadata` (jsonb) - Optional metadata (tokens, model, etc)
  
  2. Security
    - Enable RLS on `conversations` table
    - Public access for now (auth can be added later)
    - Policy allows all operations for testing

  3. Indexes
    - Index on session_id for fast conversation retrieval
    - Index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Allow all operations (can be restricted later with auth)
CREATE POLICY "Allow all operations on conversations"
  ON conversations
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
