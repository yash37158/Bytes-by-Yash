-- Create admin user for single-author blog
-- This creates the admin account that you'll use to login and publish

-- First, we need to insert the user into auth.users (this simulates Supabase Auth signup)
-- Note: In a real setup, you would sign up once through Supabase Auth UI or API
-- For now, we'll create the profile assuming the auth user exists

-- Create admin profile (assuming you've already signed up with Supabase Auth)
-- Replace 'your-email@example.com' with your actual email
INSERT INTO profiles (
  id,
  email,
  full_name,
  username,
  bio,
  avatar_url,
  is_admin,
  created_at,
  updated_at
) VALUES (
  -- You'll need to replace this UUID with your actual Supabase Auth user ID
  -- after you sign up once through the current system
  gen_random_uuid(),
  'admin@yourblog.com',
  'Blog Admin',
  'admin',
  'Welcome to my blog! I write about technology, development, and more.',
  null,
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio;

-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update RLS policies to allow admin access
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- New RLS policies for single-author blog
CREATE POLICY "Admin can do everything on profiles" ON profiles
  FOR ALL USING (auth.uid() = id AND is_admin = true);

CREATE POLICY "Public can view admin profile" ON profiles
  FOR SELECT USING (is_admin = true);

-- Update posts policies to only allow admin to create/edit
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;

CREATE POLICY "Admin can manage all posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');
