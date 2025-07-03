-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

INSERT INTO "user" (id, username, email, passwordHash, role)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@example.com',
  '$2b$10$yW7DldIOz7DZMKkWZVl3SOyI5rq4Rg6cF2qC3lvHskDaSmp3I6d4y', -- bcrypt hash of 'admin123'
  'admin'
)
ON CONFLICT (email) DO NOTHING;
