# Bytes of Yash 📝 - Personal Blog Platform

A modern, full-stack blog platform built with Next.js 15, React 19, and Supabase. Features a clean, elegant design with markdown editing, media management, and admin-only access.

## ✨ Features

- **📝 Rich Markdown Editor** - Create and edit posts with a powerful markdown toolbar
- **🎨 Clean & Elegant Design** - Modern UI with Tailwind CSS and shadcn/ui components
- **📱 Responsive Layout** - Mobile-first design that works on all devices
- **🖼️ Media Management** - Upload and manage images/videos with Vercel Blob
- **🔐 Admin Authentication** - Secure admin-only access with Supabase Auth
- **📊 Dashboard Analytics** - Track posts, views, and engagement metrics
- **🚀 SEO Optimized** - Meta tags, descriptions, and clean URLs
- **⚡ Performance** - Built with Next.js 15 and React 19 for optimal speed

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Database**: PostgreSQL with Row Level Security
- **Deployment**: Vercel-ready configuration
- **Media**: Vercel Blob for file storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd medium-clone
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   
   ```

4. **Database Setup**
   Run the SQL scripts in the `scripts/` folder:
   ```bash
   # Execute these in your Supabase SQL editor
   scripts/01-create-posts-table.sql
   scripts/02-create-tags-table.sql
   scripts/03-create-media-table.sql
   scripts/04-create-comments-table.sql
   scripts/05-seed-initial-data.sql
   scripts/06-setup-profiles-rls-policies.sql
   scripts/07-create-test-user.sql
   scripts/08-create-admin-user.sql
   scripts/09-make-current-user-admin.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Login: Use the credentials from the SQL scripts

## 📁 Project Structure

```
medium-clone/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog listing
│   ├── dashboard/         # Admin dashboard
│   ├── post/[slug]/       # Individual blog posts
│   ├── write/             # Post creation
│   └── edit/[id]/         # Post editing
├── components/            # Reusable UI components
│   ├── auth/              # Authentication forms
│   ├── blog/              # Blog-related components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Markdown editor & toolbar
│   ├── media/             # Media upload & management
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions & configurations
│   ├── actions/           # Server actions
│   ├── supabase/          # Database clients
│   └── utils.ts           # Helper functions
└── scripts/               # Database setup scripts
```

## 🔧 Key Components

### Markdown Editor
- **Rich Toolbar**: Bold, italic, headings, lists, code blocks, links, images
- **Live Preview**: See formatted content as you write
- **Media Integration**: Insert images and videos directly into posts

### Admin Dashboard
- **Post Management**: Create, edit, delete, and publish posts
- **Analytics**: Track views, reading time, and engagement
- **Media Library**: Manage uploaded files and media assets

### Authentication System
- **Admin-Only Access**: Secure admin panel with Supabase Auth
- **Session Management**: Automatic redirects and route protection
- **User Profiles**: Admin user management and permissions

## 📝 Usage

### Creating a New Post
1. Navigate to `/write` (admin only)
2. Use the markdown toolbar for formatting
3. Add media through the Media tab
4. Preview your content in real-time
5. Save as draft or publish immediately

### Managing Posts
1. Access the dashboard at `/dashboard`
2. View all posts with status indicators
3. Edit existing posts or create new ones
4. Monitor view counts and engagement

### Media Management
1. Upload images/videos through the Media tab
2. Organize files in the media library
3. Insert media directly into blog posts
4. Manage file storage and cleanup

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Admin-only access** to dashboard and write functionality
- **Protected API routes** with authentication middleware
- **Secure file uploads** with proper validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🤝 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)

---

**Happy blogging! 🚀**
