# Migration Guide: Supabase to PostgreSQL

This document outlines the migration from Supabase to a self-hosted PostgreSQL database with custom JWT authentication.

## Summary of Changes

### 1. Database Layer
- **Old**: Supabase client with built-in auth and RLS
- **New**: Direct PostgreSQL connection using `pg` library

### 2. Authentication
- **Old**: Supabase Auth with email/password
- **New**: Custom JWT-based authentication with bcrypt password hashing

### 3. Authorization
- **Old**: Row Level Security (RLS) policies in Supabase
- **New**: Application-level authorization in API routes

## File Changes

### New Files Created

#### Database Layer
- `lib/db/client.ts` - PostgreSQL connection pool and query helpers
- `lib/db/auth.ts` - Authentication utilities (JWT, bcrypt, user management)

#### API Routes
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/api/auth/me/route.ts` - Get current user endpoint

#### Database Schema
- `scripts/init-db/001_init.sql` - Database initialization script with users, posts, tags, and post_tags tables

#### Configuration
- `docker-compose.yml` - PostgreSQL and PgAdmin containers
- `.env` / `.env.example` - Environment configuration
- `DOCKER_SETUP.md` - Docker setup instructions

### Modified Files

#### API Routes
- `app/api/auth/logout/route.ts` - Updated to use cookie-based session management
- `app/api/posts/route.ts` - Updated to use PostgreSQL queries
- `app/api/posts/[id]/route.ts` - Updated to use PostgreSQL queries
- `app/api/tags/route.ts` - Updated to use PostgreSQL queries

#### Context Providers
- `lib/auth-context.tsx` - Updated to use new authentication API

## New Dependencies

```json
{
  "pg": "^8.16.3",
  "@types/pg": "^8.15.5",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.10"
}
```

## Database Schema Changes

### New Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### posts
- Now references `users(id)` instead of Supabase's `auth.users(id)`
- Added `updated_at` column

#### tags & post_tags
- Unchanged structure

### Default Data
- Default admin user: `admin@example.com` / `admin123` (CHANGE IN PRODUCTION!)
- Sample tags: Technology, Programming, Web Development, Design, Tutorial

## Authentication Flow

### Old (Supabase)
1. Client calls `supabase.auth.signInWithPassword()`
2. Supabase handles auth and sets cookies
3. Session managed by Supabase SDK

### New (Custom JWT)
1. Client calls `/api/auth/login` with credentials
2. Server validates credentials against database
3. Server generates JWT token
4. Server sets httpOnly cookie with token
5. Subsequent requests include cookie automatically
6. Server validates JWT on protected routes

## Authorization Changes

### Old (Supabase RLS)
```sql
CREATE POLICY "Authors can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);
```

### New (Application Level)
```typescript
const user = await getCurrentUser()
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

await query(
  'UPDATE posts SET ... WHERE id = $1 AND author_id = $2',
  [postId, user.id]
)
```

## Setup Instructions

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Verify Environment Variables

Ensure `.env` contains:
```env
DATABASE_URL=postgresql://blog_user:blog_password@localhost:5432/blog_db
NEXTAUTH_SECRET=change-this-to-a-secure-random-string-in-production-min-32-chars
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Test Authentication

- Navigate to `/admin`
- Login with: `admin@example.com` / `admin123`
- Create/edit posts

## API Changes

### Authentication

#### Login
```typescript
// Old
await supabase.auth.signInWithPassword({ email, password })

// New
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

#### Register
```typescript
// Old
await supabase.auth.signUp({ email, password })

// New
await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name })
})
```

#### Get Current User
```typescript
// Old
const { data: { user } } = await supabase.auth.getUser()

// New
const response = await fetch('/api/auth/me')
const { user } = await response.json()
```

#### Logout
```typescript
// Old
await supabase.auth.signOut()

// New
await fetch('/api/auth/logout', { method: 'POST' })
```

### Database Queries

#### Fetching Posts
```typescript
// Old
const { data } = await supabase
  .from('posts')
  .select('*, post_tags(tags(*))')
  .eq('status', 'published')

// New
const result = await query(`
  SELECT p.*,
    COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
    FILTER (WHERE t.id IS NOT NULL), '[]') as tags
  FROM posts p
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN tags t ON pt.tag_id = t.id
  WHERE p.status = $1
  GROUP BY p.id
`, ['published'])
```

## Security Considerations

### 1. JWT Secret
- Generate a strong random secret for production
- Minimum 32 characters
- Store securely (never commit to git)

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Password Security
- Passwords are hashed with bcrypt (salt rounds: 10)
- Never store plain text passwords
- Change default admin password immediately

### 3. HTTPS in Production
- Always use HTTPS in production
- Set cookie `secure: true` in production
- Enable CORS properly

### 4. Rate Limiting
- Consider adding rate limiting to auth endpoints
- Prevent brute force attacks

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Connect to database
docker exec -it blog_postgres psql -U blog_user -d blog_db
```

### Authentication Issues
```bash
# Check JWT secret is set
echo $NEXTAUTH_SECRET

# View auth cookie in browser DevTools
# Application > Cookies > auth-token
```

### Migration Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Check database tables
docker exec -it blog_postgres psql -U blog_user -d blog_db -c "\dt"
```

## Next Steps

1. ✅ Replace Supabase with PostgreSQL
2. ✅ Implement JWT authentication
3. ✅ Update API routes
4. ✅ Update context providers
5. 🔄 Remove Supabase dependencies (optional - can keep for reference)
6. 🔄 Add rate limiting
7. 🔄 Add email verification
8. 🔄 Add password reset flow
9. 🔄 Add refresh tokens
10. 🔄 Add session management

## Rolling Back

If you need to roll back to Supabase:

1. Restore old files from git:
   ```bash
   git checkout HEAD~1 lib/auth-context.tsx
   git checkout HEAD~1 app/api/
   ```

2. Remove new database files:
   ```bash
   rm -rf lib/db
   ```

3. Reinstall Supabase dependencies:
   ```bash
   pnpm install @supabase/supabase-js @supabase/ssr
   ```

4. Restore Supabase environment variables

## Support

For issues or questions:
- Check DOCKER_SETUP.md for database setup
- Review MIGRATION_GUIDE.md for detailed changes
- Check application logs for errors

---

**Last Updated**: 2025-10-22
**Migration Status**: ✅ Complete
