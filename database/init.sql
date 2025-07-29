-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the user table
-- CREATE TABLE IF NOT EXISTS "user" (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   username TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE,
--   passwordhash TEXT NOT NULL,
--   role TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Insert default admin user (bcrypt hash of 'admin123')
-- INSERT INTO "user" (username, email, passwordhash, role)
-- VALUES (
--   'Admin',
--   'admin@example.com',
--   '$2b$10$yW7DldIOz7DZMKkWZVl3SOyI5rq4Rg6cF2qC3lvHskDaSmp3I6d4y',
--   'admin'
-- )
-- ON CONFLICT (email) DO NOTHING;
