# Backend Integration Status

## ✅ Completed

### 1. NestJS Backend Setup
- Installed all required dependencies (NestJS, Prisma, JWT, Swagger, validation)
- Created Hexagonal Architecture directory structure
- Configured TypeScript with path aliases
- Set up environment variables (.env)

### 2. Shared Infrastructure
- **PrismaService** (`src/shared/database/prisma.service.ts`) - Database connection management
- **Database Config** (`src/config/database.config.ts`) - Database configuration
- **JWT Config** (`src/config/jwt.config.ts`) - JWT settings
- **CurrentUser Decorator** (`src/common/decorators/current-user.decorator.ts`)
- **JwtAuthGuard** (`src/common/guards/jwt-auth.guard.ts`)
- **AllExceptionsFilter** (`src/common/filters/http-exception.filter.ts`)

### 3. Auth Module (Complete Implementation)
All layers implemented following Hexagonal Architecture:

**Domain Layer**:
- User Entity (`src/modules/auth/domain/entities/user.entity.ts`)
- IUserRepository interface (`src/modules/auth/domain/repositories/user.repository.interface.ts`)

**Infrastructure Layer**:
- PrismaUserRepository (`src/modules/auth/infrastructure/persistence/repositories/prisma-user.repository.ts`)
- JwtStrategy (`src/modules/auth/infrastructure/strategies/jwt.strategy.ts`)

**Application Layer**:
- RegisterUseCase (`src/modules/auth/application/use-cases/register.use-case.ts`)
- LoginUseCase (`src/modules/auth/application/use-cases/login.use-case.ts`)

**Presentation Layer**:
- RegisterRequestDto (`src/modules/auth/presentation/dtos/register.dto.ts`)
- LoginRequestDto (`src/modules/auth/presentation/dtos/login.dto.ts`)
- AuthController (`src/modules/auth/presentation/controllers/auth.controller.ts`)

**Module Configuration**:
- AuthModule (`src/modules/auth/auth.module.ts`)

### 4. Application Setup
- **App Module** (`src/app.module.ts`) - Root module with Auth module
- **Main.ts** (`src/main.ts`) - Application bootstrap with:
  - Global API prefix `/api`
  - CORS enabled
  - Global validation pipes
  - Global exception filters
  - Swagger documentation at `/api/docs`

### 5. Database Integration
- Prisma schema introspected from existing database
- Prisma client generated
- Database successfully connected

### 6. Server Status
- ✅ TypeScript compilation successful
- ✅ Server running on http://localhost:3001
- ✅ Swagger docs available at http://localhost:3001/api/docs
- ✅ Routes registered:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/profile`

## 🔧 Issues to Fix

### Critical: Auth Endpoint Error
The auth endpoints return 500 error. **Root cause**: Mismatch between domain model and Prisma schema types.

**Problem**:
1. Prisma schema has `role` as `String?` but our domain entity expects `'USER' | 'ADMIN'`
2. Prisma timestamps are optional (`DateTime?`) but domain entity expects required `Date`

**Solution** (Apply these changes):

#### 1. Fix Prisma User Repository

```typescript
// src/modules/auth/infrastructure/persistence/repositories/prisma-user.repository.ts

async save(user: User): Promise<User> {
  const created = await this.prisma.user.create({
    data: {
      email: user.email,
      passwordHash: user.getPasswordHash(),
      name: user.name,
      role: user.role.toLowerCase(), // Convert to lowercase for database
    },
  });
  return this.toDomain(created);
}

private toDomain(prismaUser: any): User {
  return new User(
    prismaUser.id,
    prismaUser.email,
    prismaUser.passwordHash,
    prismaUser.name,
    (prismaUser.role?.toUpperCase() || 'USER') as 'USER' | 'ADMIN', // Convert back to uppercase
    prismaUser.createdAt || new Date(),
    prismaUser.updatedAt || new Date(),
  );
}
```

#### 2. Alternative: Update Prisma Schema

Update the schema to match domain model expectations:

```prisma
model User {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String?
  role         String   @default("user") // Remove optional, make required
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6) // Remove optional
  updatedAt    DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6) // Remove optional
  posts        Post[]

  @@index([email], map: "idx_users_email")
  @@map("users")
}
```

Then run:
```bash
npx prisma db push
npx prisma generate
```

## 🚀 Next Steps

### 1. Fix Auth Endpoints
Apply the solutions above to fix the 500 error

### 2. Test Auth Endpoints
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Profile (use token from login response)
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Implement Posts Module

Follow the same Hexagonal Architecture pattern:

**Domain Layer**:
- Post entity
- PostTranslation entity
- IPostRepository interface

**Infrastructure Layer**:
- PrismaPostRepository

**Application Layer**:
- CreatePostUseCase
- UpdatePostUseCase
- GetPostsUseCase (with locale support)
- PublishPostUseCase

**Presentation Layer**:
- CreatePostDto, UpdatePostDto
- PostsController

**Key Features**:
- Support for translations (en/vi)
- Table of contents generation
- Tag management
- Status management (DRAFT/PUBLISHED)

### 4. Implement Tags Module

**Domain Layer**:
- Tag entity
- ITagRepository interface

**Infrastructure Layer**:
- PrismaTagRepository

**Application Layer**:
- CreateTagUseCase
- GetTagsUseCase
- GetPostsByTagUseCase

**Presentation Layer**:
- CreateTagDto
- TagsController

### 5. Update Frontend to Use New Backend

#### Update Environment Variables
Add to `/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Update Auth Context
```typescript
// lib/auth-context.tsx

const signIn = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    // Store JWT token in localStorage or cookie
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    setIsAuthenticated(true);
    return { error: null };
  }
  return { error: data.message || 'Login failed' };
};

const signOut = async () => {
  localStorage.removeItem('accessToken');
  setUser(null);
  setIsAuthenticated(false);
};

const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const user = await response.json();
    setUser(user);
    setIsAuthenticated(true);
  }
};
```

#### Update Blog Context
```typescript
// lib/blog-context.tsx

const fetchPosts = async (locale: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?locale=${locale}&status=published`
  );
  const posts = await response.json();
  setPosts(posts);
};

const fetchPost = async (id: string, locale: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}?locale=${locale}`
  );
  return await response.json();
};
```

### 6. Remove Old Next.js API Routes
Once everything is tested and working:
```bash
rm -rf app/api
```

### 7. Testing
```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📁 Current File Structure

```
backend/
├── prisma/
│   └── schema.prisma               # Database schema
├── src/
│   ├── common/                     # Shared utilities
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── config/                     # Configuration
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── modules/                    # Feature modules
│   │   └── auth/                   # Auth module
│   │       ├── application/
│   │       │   └── use-cases/
│   │       │       ├── register.use-case.ts
│   │       │       └── login.use-case.ts
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   └── user.entity.ts
│   │       │   └── repositories/
│   │       │       └── user.repository.interface.ts
│   │       ├── infrastructure/
│   │       │   ├── persistence/
│   │       │   │   └── repositories/
│   │       │   │       └── prisma-user.repository.ts
│   │       │   └── strategies/
│   │       │       └── jwt.strategy.ts
│   │       ├── presentation/
│   │       │   ├── controllers/
│   │       │   │   └── auth.controller.ts
│   │       │   └── dtos/
│   │       │       ├── register.dto.ts
│   │       │       └── login.dto.ts
│   │       └── auth.module.ts
│   ├── shared/                     # Shared domain
│   │   └── database/
│   │       └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env                            # Environment variables
├── package.json
└── tsconfig.json
```

## 🎯 API Endpoints (Current)

### Auth Endpoints
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get JWT
GET    /api/auth/profile     - Get current user (protected)
```

### Future Endpoints (To Implement)

**Posts**:
```
GET    /api/posts                      - List posts (with locale)
GET    /api/posts/:id                  - Get post (with locale)
POST   /api/posts                      - Create post (admin only)
PUT    /api/posts/:id                  - Update post (admin only)
DELETE /api/posts/:id                  - Delete post (admin only)
PATCH  /api/posts/:id/publish          - Publish post (admin only)
POST   /api/posts/:id/translations     - Add/update translation (admin only)
GET    /api/posts/:id/translations     - Get all translations
DELETE /api/posts/:id/translations/:locale - Delete translation (admin only)
```

**Tags**:
```
GET    /api/tags              - List all tags
GET    /api/tags/:id          - Get tag
POST   /api/tags              - Create tag (admin only)
GET    /api/tags/:slug/posts  - Get posts by tag
```

## 📚 Documentation

- **Swagger/OpenAPI**: http://localhost:3001/api/docs
- **Architecture Guide**: `/backend/ARCHITECTURE.md`
- **Implementation Guide**: `/backend/IMPLEMENTATION_GUIDE.md`

## 🔐 Security

- JWT authentication with access tokens
- Password hashing with bcrypt (10 rounds)
- CORS protection
- Input validation with class-validator
- Global exception handling

## 🚦 Quick Commands

```bash
# Development
cd backend
pnpm run start:dev        # Start development server

# Build
pnpm run build            # Build for production
pnpm run start:prod       # Run production server

# Database
npx prisma studio         # Open Prisma Studio
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma Client

# Testing
pnpm run test            # Run unit tests
pnpm run test:e2e        # Run e2e tests
pnpm run test:cov        # Run with coverage
```

## 💡 Tips

1. **Always restart the server** after Prisma schema changes and running `npx prisma generate`
2. **Use Swagger UI** at `/api/docs` for testing endpoints
3. **Check server logs** for detailed error messages
4. **Keep domain logic pure** - no framework dependencies in domain layer
5. **Use dependency injection** - inject repositories through interfaces

## ⚠️ Known Issues

1. Auth endpoints returning 500 - needs type mismatch fix (see above)
2. Need to implement Posts and Tags modules
3. Frontend still using old Next.js API routes
4. No tests written yet

---

**Status**: Foundation complete, Auth module implemented, ready for Posts/Tags modules and frontend integration.
