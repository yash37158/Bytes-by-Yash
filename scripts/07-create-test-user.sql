-- Create a test user account
-- Note: This creates the profile directly, but you'll still need to sign up through the UI
-- since Supabase Auth handles the actual authentication

-- Insert a test profile (the auth user will need to be created through signup)
INSERT INTO profiles (
  id,
  email,
  full_name,
  username,
  bio,
  avatar_url,
  website,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- This will be replaced when you actually sign up
  'test@example.com',
  'Test User',
  'testuser',
  'A test user for the blog platform',
  null,
  'https://example.com',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;
