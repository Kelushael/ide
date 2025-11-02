/*
  # Agent Marketplace Schema

  ## Overview
  Creates the foundation for the unstealable agent marketplace where:
  - Agents are FREE to use and share
  - Creators earn 70% from premium agents
  - More copies = stronger network
  - Community owns the ecosystem

  ## New Tables
  
  ### `agents`
  Core agent definitions that anyone can use
  - `id` (uuid, primary key)
  - `name` (text) - Agent display name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - What this agent does
  - `system_prompt` (text) - The agent's instructions
  - `tools` (jsonb) - Available tools [file, docker, git, etc]
  - `tier` (text) - 'free' | 'pro' | 'enterprise'
  - `price` (integer) - Price in cents (0 for free)
  - `creator_id` (uuid) - Who created it
  - `install_count` (integer) - Network effect metric
  - `rating` (numeric) - Average rating
  - `is_public` (boolean) - Published to marketplace
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `agent_installs`
  Track who's using which agents (network growth)
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Who installed
  - `agent_id` (uuid) - Which agent
  - `installed_at` (timestamptz)

  ### `agent_ratings`
  Community feedback loop
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Who rated
  - `agent_id` (uuid) - What they rated
  - `rating` (integer) - 1-5 stars
  - `review` (text) - Optional feedback
  - `created_at` (timestamptz)

  ### `agent_executions`
  Track usage for network effects and creator payouts
  - `id` (uuid, primary key)
  - `agent_id` (uuid) - Which agent ran
  - `user_id` (uuid) - Who ran it
  - `session_id` (text) - Execution session
  - `tokens_used` (integer) - For potential future pricing
  - `success` (boolean) - Did it complete
  - `executed_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Anyone can READ public agents (free distribution)
  - Only creators can UPDATE their agents
  - Installs and ratings require authentication
  - Execution tracking is automatic

  ## Network Effects
  - More installs → Higher visibility
  - More ratings → Better discovery
  - More executions → Creator earnings
  - More creators → Better agents
  - ALL DATA PUBLIC → Unstealable
*/

-- Agents table: The core of the marketplace
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  system_prompt text NOT NULL,
  tools jsonb DEFAULT '[]'::jsonb,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  price integer DEFAULT 0 CHECK (price >= 0),
  creator_id uuid,
  install_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent installs: Track network growth
CREATE TABLE IF NOT EXISTS agent_installs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  installed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Agent ratings: Community feedback
CREATE TABLE IF NOT EXISTS agent_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Agent executions: Usage tracking for payouts
CREATE TABLE IF NOT EXISTS agent_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  tokens_used integer DEFAULT 0,
  success boolean DEFAULT true,
  executed_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_public ON agents(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_agents_creator ON agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agent_installs_user ON agent_installs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_installs_agent ON agent_installs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_ratings_agent ON agent_ratings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user ON agent_executions(user_id);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Open by default, secure by design

-- AGENTS: Anyone can read public agents (free distribution!)
CREATE POLICY "Public agents are viewable by everyone"
  ON agents FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own agents"
  ON agents FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own agents"
  ON agents FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- INSTALLS: Track who's using what
CREATE POLICY "Users can view their own installs"
  ON agent_installs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can install agents"
  ON agent_installs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can uninstall agents"
  ON agent_installs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RATINGS: Community feedback
CREATE POLICY "Anyone can read ratings"
  ON agent_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate agents"
  ON agent_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON agent_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON agent_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- EXECUTIONS: Track for network effects
CREATE POLICY "Users can view their own executions"
  ON agent_executions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can log executions"
  ON agent_executions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Functions: Update derived stats automatically

-- Update agent rating when new rating added
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agents
  SET rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM agent_ratings
    WHERE agent_id = NEW.agent_id
  )
  WHERE id = NEW.agent_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_rating_updated
  AFTER INSERT OR UPDATE ON agent_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_rating();

-- Update install count when someone installs
CREATE OR REPLACE FUNCTION update_install_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agents
    SET install_count = install_count + 1
    WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agents
    SET install_count = install_count - 1
    WHERE id = OLD.agent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_install_count_updated
  AFTER INSERT OR DELETE ON agent_installs
  FOR EACH ROW
  EXECUTE FUNCTION update_install_count();

-- Seed with starter agents
INSERT INTO agents (name, slug, description, system_prompt, tools, tier, is_public) VALUES
(
  'React Pro',
  'react-pro',
  'Builds production-ready React applications with TypeScript, Tailwind, and best practices',
  'You are a React expert. Build modern, production-ready React apps using TypeScript, functional components, hooks, and Tailwind CSS. Follow best practices for performance, accessibility, and code organization.',
  '["file", "npm", "git"]'::jsonb,
  'free',
  true
),
(
  'API Builder',
  'api-builder',
  'Creates REST APIs with proper validation, error handling, and documentation',
  'You are an API expert. Build RESTful APIs with proper validation, error handling, authentication, and documentation. Support multiple languages and frameworks.',
  '["file", "docker", "postgres", "git"]'::jsonb,
  'free',
  true
),
(
  'Bug Hunter',
  'bug-hunter',
  'Finds and fixes bugs with detailed explanations',
  'You are a debugging expert. Analyze code to find bugs, explain root causes, and provide fixes with detailed explanations. Focus on edge cases and error handling.',
  '["file", "git", "test"]'::jsonb,
  'free',
  true
),
(
  'DevOps Agent',
  'devops-agent',
  'Sets up CI/CD, Docker, and cloud deployments',
  'You are a DevOps expert. Configure CI/CD pipelines, containerize applications with Docker, set up cloud infrastructure, and automate deployments.',
  '["file", "docker", "git", "cloud"]'::jsonb,
  'free',
  true
),
(
  'Code Reviewer',
  'code-reviewer',
  'Reviews code for quality, security, and best practices',
  'You are a code review expert. Analyze code for quality issues, security vulnerabilities, performance problems, and adherence to best practices. Provide constructive feedback.',
  '["file", "git"]'::jsonb,
  'free',
  true
)
ON CONFLICT (slug) DO NOTHING;