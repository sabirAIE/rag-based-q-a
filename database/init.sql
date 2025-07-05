-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create user table first
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Then insert admin user
INSERT INTO "user" (username, email, passwordHash, role)
VALUES (
  'Admin',
  'admin@example.com',
  '$2b$10$yW7DldIOz7DZMKkWZVl3SOyI5rq4Rg6cF2qC3lvHskDaSmp3I6d4y', -- bcrypt hash of 'admin123'
  'admin'
)
ON CONFLICT (email) DO NOTHING;