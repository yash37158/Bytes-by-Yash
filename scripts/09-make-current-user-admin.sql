-- Make the current user an admin
-- This will update your existing profile to have admin privileges

-- First, add the is_admin column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update your profile to be admin (replace with your actual email)
UPDATE profiles 
SET is_admin = true,
    username = 'Yash',
    bio = 'Welcome to my blog! I write about technology, development, and more.'
WHERE email = 'yash37158@gmail.com';

-- If you used a different email, update this query with your actual email:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-actual-email@example.com';

-- Update RLS policies for single-author blog
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- New RLS policies
CREATE POLICY "Admin can do everything on profiles" ON profiles
  FOR ALL USING (auth.uid() = id AND is_admin = true);

CREATE POLICY "Public can view admin profile" ON profiles
  FOR SELECT USING (is_admin = true);

-- Update posts policies to only allow admin
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
