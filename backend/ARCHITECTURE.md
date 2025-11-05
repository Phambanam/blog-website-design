# Backend Architecture Documentation

## Overview

This NestJS backend implements **Hexagonal (Ports & Adapters) Architecture** with a **Modular Monolith** approach.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers, DTOs, Validation)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Application Layer                │
│    (Use Cases, Business Logic)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Domain Layer                   │
│    (Entities, Value Objects, Rules)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Infrastructure Layer              │
│  (Database, External Services, Adapters)│
└─────────────────────────────────────────┘
```

## Directory Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── utils/
│   ├── config/              # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── swagger.config.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/
│   │   │   ├── application/   # Use cases
│   │   │   │   ├── services/
│   │   │   │   └── use-cases/
│   │   │   ├── domain/        # Domain logic
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/  # Interfaces
│   │   │   │   └── value-objects/
│   │   │   ├── infrastructure/ # Implementations
│   │   │   │   ├── persistence/
│   │   │   │   │   ├── prisma/
│   │   │   │   │   └── repositories/
│   │   │   │   └── adapters/
│   │   │   ├── presentation/  # API Layer
│   │   │   │   ├── controllers/
│   │   │   │   ├── dtos/
│   │   │   │   └── mappers/
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   ├── posts/
│   │   └── tags/
│   ├── shared/              # Shared domain
│   │   ├── database/
│   │   │   └── prisma.service.ts
│   │   └── interfaces/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── test/
│   ├── e2e/
│   └── unit/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Module Structure (Hexagonal)

Each module follows this structure:

### 1. Domain Layer (`domain/`)
- **Entities**: Core business objects
- **Value Objects**: Immutable domain concepts
- **Repository Interfaces**: Ports for data access
- **Domain Services**: Complex business logic

### 2. Application Layer (`application/`)
- **Use Cases**: Specific business operations
- **Application Services**: Orchestrate use cases
- **DTOs (Internal)**: Data transfer within application

### 3. Infrastructure Layer (`infrastructure/`)
- **Repositories (Implementations)**: Database adapters
- **External Services**: Third-party integrations
- **Persistence**: Prisma models and queries

### 4. Presentation Layer (`presentation/`)
- **Controllers**: HTTP request handlers
- **DTOs (External)**: API request/response shapes
- **Validators**: Input validation
- **Mappers**: Convert between layers

## Key Principles

### 1. Dependency Rule
Dependencies point inward:
- Presentation → Application → Domain
- Infrastructure → Domain (implements interfaces)

### 2. Ports & Adapters
- **Ports**: Interfaces defined in domain
- **Adapters**: Implementations in infrastructure

### 3. Separation of Concerns
- Each layer has distinct responsibility
- No business logic in controllers
- No infrastructure details in domain

## Modules Overview

### Auth Module
**Responsibility**: Authentication & Authorization

**Use Cases**:
- Register user
- Login user
- Validate JWT token
- Refresh token

**Domain Entities**:
- User (aggregate root)
- Token (value object)

**Infrastructure**:
- Prisma User Repository
- JWT Service (adapter)
- Bcrypt Service (adapter)

### Users Module
**Responsibility**: User management

**Use Cases**:
- Get user profile
- Update user
- Delete user

**Domain Entities**:
- User
- Email (value object)
- Password (value object)

### Posts Module
**Responsibility**: Blog post management with i18n

**Use Cases**:
- Create post
- Update post
- Delete post
- Publish post
- Manage translations
- Generate TOC

**Domain Entities**:
- Post (aggregate root)
- Translation (entity)
- Tag (value object)
- TableOfContents (value object)

**Infrastructure**:
- Prisma Post Repository
- TOC Generator Service

### Tags Module
**Responsibility**: Tag management

**Use Cases**:
- Create tag
- Get all tags
- Get posts by tag

**Domain Entities**:
- Tag

## Data Flow Example

### Creating a Post with Translation

```typescript
// 1. Presentation Layer (Controller)
@Post()
async createPost(@Body() dto: CreatePostDto) {
  return this.createPostUseCase.execute(dto);
}

// 2. Application Layer (Use Case)
class CreatePostUseCase {
  async execute(dto: CreatePostDto) {
    const post = Post.create(dto);
    await this.postRepository.save(post);
    return this.mapper.toDto(post);
  }
}

// 3. Domain Layer (Entity)
class Post {
  static create(data) {
    // Business rules validation
    return new Post(data);
  }
}

// 4. Infrastructure Layer (Repository)
class PrismaPostRepository implements IPostRepository {
  async save(post: Post) {
    return this.prisma.post.create({ data: post });
  }
}
```

## Database Design (Prisma)

### Schema Highlights

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String?
  role          Role     @default(USER)
  posts         Post[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Post {
  id               String            @id @default(uuid())
  authorId         String
  author           User              @relation(fields: [authorId], references: [id])
  featuredImage    String?
  status           PostStatus        @default(DRAFT)
  readTime         Int?
  tableOfContents  Json?
  translations     PostTranslation[]
  tags             PostTag[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model PostTranslation {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  locale    String
  title     String
  excerpt   String?
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([postId, locale])
}

model Tag {
  id        String    @id @default(uuid())
  name      String    @unique
  slug      String    @unique
  posts     PostTag[]
  createdAt DateTime  @default(now())
}

model PostTag {
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}

enum Role {
  USER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
}
```

## API Design (RESTful)

### Auth Endpoints
```
POST   /auth/register         # Register new user
POST   /auth/login            # Login
POST   /auth/refresh          # Refresh token
POST   /auth/logout           # Logout
GET    /auth/profile          # Get current user
```

### Posts Endpoints
```
GET    /posts                 # List posts (with locale query)
GET    /posts/:id             # Get post (with locale query)
POST   /posts                 # Create post
PUT    /posts/:id             # Update post
DELETE /posts/:id             # Delete post
PATCH  /posts/:id/publish     # Publish post
POST   /posts/:id/translations # Add/update translation
GET    /posts/:id/translations # Get all translations
DELETE /posts/:id/translations/:locale # Delete translation
```

### Users Endpoints
```
GET    /users/:id             # Get user
PUT    /users/:id             # Update user
DELETE /users/:id             # Delete user
```

### Tags Endpoints
```
GET    /tags                  # List all tags
GET    /tags/:id              # Get tag
POST   /tags                  # Create tag
GET    /tags/:slug/posts      # Get posts by tag
```

## Validation & DTOs

### Example DTO with Validation

```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
```

## Error Handling

### Custom Exception Filter

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Standardized error response
  }
}
```

### Domain Exceptions

```typescript
export class PostNotFoundException extends DomainException {
  constructor(postId: string) {
    super(`Post with ID ${postId} not found`);
  }
}
```

## Testing Strategy

### Unit Tests
- Test domain entities
- Test use cases in isolation
- Mock dependencies

### Integration Tests
- Test repository implementations
- Test database operations

### E2E Tests
- Test complete API flows
- Test authentication
- Test business scenarios

### Example Test Structure

```typescript
describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let mockRepository: jest.Mocked<IPostRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new CreatePostUseCase(mockRepository);
  });

  it('should create a post successfully', async () => {
    // Test implementation
  });
});
```

## Security

### JWT Authentication
- Access tokens (short-lived)
- Refresh tokens (long-lived)
- Token rotation

### Authorization
- Role-based access control (RBAC)
- Guards for protected routes
- Owner-based permissions

### Validation
- Class-validator for DTOs
- Custom validators for business rules
- Sanitization of inputs

## Performance

### Caching Strategy
- Redis for session management
- Cache frequently accessed data
- Invalidation on updates

### Database Optimization
- Proper indexing
- Query optimization with Prisma
- Connection pooling

## Deployment

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/db
    depends_on:
      - postgres
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://blog_user:blog_password@localhost:5433/blog_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## Next Steps

1. ✅ Setup NestJS project
2. 🔄 Configure Prisma
3. 🔄 Implement Auth module
4. 🔄 Implement Posts module
5. 🔄 Add Swagger documentation
6. 🔄 Write tests
7. 🔄 Setup Docker Compose
8. 🔄 Migrate frontend to use new API

---

**Architecture Pattern**: Hexagonal (Ports & Adapters)
**Design Pattern**: Modular Monolith
**ORM**: Prisma
**Testing**: Jest + Supertest
**Documentation**: Swagger/OpenAPI
**Deployment**: Docker + Docker Compose
