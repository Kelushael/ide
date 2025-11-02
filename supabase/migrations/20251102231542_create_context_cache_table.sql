/*
  # Create Context Cache Storage

  1. New Tables
    - `context_cache`
      - `id` (uuid, primary key) - Unique cache entry ID
      - `project_path` (text) - Project directory path
      - `file_path` (text) - Specific file path
      - `content_hash` (text) - SHA256 hash of content for change detection
      - `summary` (text) - AI-generated summary of file/project
      - `tokens` (integer) - Estimated token count
      - `last_accessed` (timestamptz) - For cache eviction
      - `created_at` (timestamptz) - When cached
  
  2. Security
    - Enable RLS
    - Public access for local usage
  
  3. Indexes
    - Unique index on project_path + file_path
    - Index on last_accessed for cache cleanup
*/

CREATE TABLE IF NOT EXISTS context_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_path text NOT NULL,
  file_path text NOT NULL,
  content_hash text NOT NULL,
  summary text DEFAULT '',
  tokens integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_path, file_path)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_context_cache_last_accessed ON context_cache(last_accessed DESC);
CREATE INDEX IF NOT EXISTS idx_context_cache_project ON context_cache(project_path);

-- Enable RLS
ALTER TABLE context_cache ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all operations on context_cache"
  ON context_cache
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
