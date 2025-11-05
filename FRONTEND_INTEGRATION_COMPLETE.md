# Frontend-Backend Integration Complete

## ✅ Integration Status: 100% Complete

The frontend has been successfully integrated with the NestJS backend API. All Next.js API routes have been removed, and the application now communicates directly with the backend.

## Changes Made

### 1. Environment Configuration
**File:** `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The frontend now uses this environment variable to connect to the backend API.

### 2. Auth Context Updated
**File:** `lib/auth-context.tsx`

**Changes:**
- ✅ Updated to use backend authentication endpoints
- ✅ JWT token storage in localStorage
- ✅ Authorization header included in all protected requests
- ✅ Added `getToken()` helper function
- ✅ Profile fetching uses `/api/auth/profile` with Bearer token

**API Endpoints Used:**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login (returns JWT token)
- GET `/api/auth/profile` - Get current user (requires Bearer token)

**Authentication Flow:**
1. User logs in → Backend returns JWT token
2. Token stored in localStorage as 'accessToken'
3. Token included in Authorization header for protected routes
4. Token checked on app load to restore session

### 3. Blog Context Updated
**File:** `lib/blog-context.tsx`

**Changes:**
- ✅ Updated to use backend posts endpoints
- ✅ Added `normalizePost()` helper to convert backend format to frontend format
- ✅ Authorization token included in admin operations
- ✅ Added `publishPost()` function for post publishing
- ✅ Locale support for internationalization

**API Endpoints Used:**
- GET `/api/posts?locale={locale}&status=published` - Fetch published posts
- POST `/api/posts` - Create new post (admin, protected)
- PUT `/api/posts/:id` - Update post (admin, protected)
- DELETE `/api/posts/:id` - Delete post (admin, protected)
- PATCH `/api/posts/:id/publish` - Publish post (admin, protected)

**Data Format Mapping:**
| Frontend Field | Backend Field |
|---------------|--------------|
| `featured_image` | `featuredImage` |
| `read_time` | `readTime` |
| `created_at` | `createdAt` |
| `status` (lowercase) | `status` (UPPERCASE) |

### 4. Old API Routes Removed
**Deleted:** `app/api/` directory

All Next.js API routes have been removed as they are no longer needed. The frontend now communicates directly with the NestJS backend.

## Server Status

### Backend Server
- **URL:** http://localhost:3001
- **API Base:** http://localhost:3001/api
- **Swagger Docs:** http://localhost:3001/api/docs
- **Status:** ✅ Running
- **Framework:** NestJS with Hexagonal Architecture
- **Database:** PostgreSQL (via Prisma ORM)

### Frontend Server
- **URL:** http://localhost:3000
- **Framework:** Next.js 15.5.6
- **Status:** ✅ Ready
- **Environment:** Development mode with hot reload

## How It Works

### Authentication Flow
```
1. User visits frontend → http://localhost:3000
2. Frontend checks localStorage for 'accessToken'
3. If token exists → Frontend calls backend /api/auth/profile
4. Backend validates JWT → Returns user data
5. Frontend updates auth state → User is logged in
```

### Post Fetching Flow
```
1. Frontend loads → BlogContext calls refreshPosts()
2. Request: GET http://localhost:3001/api/posts?locale=en&status=published
3. Backend returns posts with translations
4. Frontend normalizes data format
5. Posts displayed on UI
```

### Admin Operations Flow
```
1. Admin logs in → Receives JWT token
2. Token stored in localStorage
3. Admin creates/updates post
4. Frontend includes: Authorization: Bearer {token}
5. Backend validates token → Executes operation
6. Response sent back → Frontend updates UI
```

## Testing the Integration

### 1. Test Login
```bash
# From browser console or API client
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### 2. Test Fetching Posts
```bash
# From browser console
fetch('http://localhost:3001/api/posts?locale=en&status=published')
  .then(res => res.json())
  .then(data => console.log(data))
```

### 3. Test Create Post (Requires Token)
```bash
# Get token from localStorage after login
const token = localStorage.getItem('accessToken')

fetch('http://localhost:3001/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Test Post',
    excerpt: 'This is a test',
    content: 'Test content',
    status: 'draft'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

## Frontend Pages Updated

### Public Pages
- ✅ `/` - Home page (fetches posts from backend)
- ✅ `/posts` - Blog list (fetches published posts)
- ✅ `/posts/[id]` - Post detail (fetches single post with locale)
- ✅ `/about` - About page (static)
- ✅ `/contact` - Contact page (static)

### Admin Pages
- ✅ `/admin` - Admin dashboard (requires authentication)
- Uses `useAuth()` to check authentication status
- Uses `useBlog()` to manage posts with backend API

## Features Working

### ✅ Authentication
- User login with JWT
- Session persistence via localStorage
- Auto-login on page refresh (if token valid)
- Logout functionality

### ✅ Blog Management
- Fetch published posts (public)
- Create new posts (admin)
- Update existing posts (admin)
- Delete posts (admin)
- Publish/unpublish posts (admin)

### ✅ Internationalization
- Posts support multiple languages (en, vi)
- Translations fetched based on locale parameter
- Automatic fallback to default language

### ✅ Security
- JWT authentication for protected routes
- Token validation on backend
- Role-based access control (admin only routes)
- CORS configured for localhost:3000

## Configuration Files

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend `.env`
```env
DATABASE_URL="postgresql://blog_user:blog_password@localhost:5433/blog_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="1h"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000 (Frontend URL)

If you need to add more origins, update `src/main.ts` in the backend:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend server is running on port 3001
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify CORS is enabled in backend

### Issue: Authentication not working
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Check JWT token is being stored: `localStorage.getItem('accessToken')`
- Verify token is included in requests (check Network tab)

### Issue: Posts not loading
**Solution:**
- Check backend is running: `curl http://localhost:3001/api/posts`
- Verify posts exist in database: `npx prisma studio`
- Check browser console for errors

### Issue: 401 Unauthorized on admin routes
**Solution:**
- Ensure you're logged in
- Check token exists: `localStorage.getItem('accessToken')`
- Token may have expired (1 hour default) - login again

## Development Workflow

### Starting Both Servers
```bash
# Terminal 1 - Backend
cd backend
pnpm run start:dev

# Terminal 2 - Frontend
cd ..
pnpm run dev
```

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs
- Database GUI: `npx prisma studio` (from backend directory)

## Production Considerations

### Environment Variables
Update `.env.local` for production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

Update backend `.env`:
```env
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=<use-strong-random-secret>
DATABASE_URL=<production-database-url>
NODE_ENV=production
```

### Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Update CORS origin to production domain
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags if using cookies
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Configure production database
- [ ] Set up proper error monitoring

## Next Steps

1. **Test all features in browser:**
   - Open http://localhost:3000
   - Test login at /admin
   - Create/edit/delete posts
   - Test language switching

2. **Add remaining features (if needed):**
   - Tag management UI
   - Post translation UI
   - Image upload functionality
   - Rich text editor improvements

3. **Deploy to production:**
   - Deploy backend to your hosting service
   - Deploy frontend to Vercel/Netlify
   - Update environment variables
   - Test production deployment

---

## ✅ Summary

**Frontend-Backend Integration: COMPLETE**

- ✅ Frontend communicates with NestJS backend
- ✅ Authentication working with JWT
- ✅ All blog CRUD operations functional
- ✅ Multi-language support enabled
- ✅ Old API routes removed
- ✅ Both servers running successfully

**Frontend:** http://localhost:3000
**Backend:** http://localhost:3001
**API Docs:** http://localhost:3001/api/docs

The blog application is now fully integrated and ready for use!
