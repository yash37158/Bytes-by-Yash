-- Insert some initial categories if they don't exist
INSERT INTO categories (name, slug, description, color) VALUES
  ('Technology', 'technology', 'Articles about technology, programming, and development', '#3B82F6'),
  ('Design', 'design', 'UI/UX design, visual design, and creative content', '#8B5CF6'),
  ('Business', 'business', 'Business insights, entrepreneurship, and industry trends', '#10B981'),
  ('Personal', 'personal', 'Personal stories, experiences, and reflections', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- Insert some initial tags
INSERT INTO tags (name, slug, description, color) VALUES
  ('JavaScript', 'javascript', 'JavaScript programming language', '#F7DF1E'),
  ('React', 'react', 'React framework and ecosystem', '#61DAFB'),
  ('Next.js', 'nextjs', 'Next.js framework', '#000000'),
  ('TypeScript', 'typescript', 'TypeScript programming language', '#3178C6'),
  ('Web Development', 'web-development', 'General web development topics', '#FF6B6B'),
  ('Tutorial', 'tutorial', 'Step-by-step tutorials and guides', '#4ECDC4'),
  ('Opinion', 'opinion', 'Personal opinions and thoughts', '#45B7D1'),
  ('News', 'news', 'Industry news and updates', '#96CEB4')
ON CONFLICT (slug) DO NOTHING;
