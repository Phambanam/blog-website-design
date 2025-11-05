# Users Module

This module handles user management operations in the blog application.

## Architecture

Following clean architecture principles with four layers:

### Domain Layer

- **Entities**: `User` entity with business logic
- **Repositories**: `IUserRepository` interface defining data access contract

### Application Layer (Use Cases)

- `GetUsersUseCase` - List all users with pagination
- `GetUserUseCase` - Get a single user by ID
- `CreateUserUseCase` - Create a new user
- `UpdateUserUseCase` - Update user details
- `DeleteUserUseCase` - Delete a user

### Infrastructure Layer

- `PrismaUserRepository` - Prisma implementation of user repository

### Presentation Layer

- `UsersController` - REST API endpoints for user management
- DTOs for request validation:
  - `CreateUserDto` - Validation for user creation
  - `UpdateUserDto` - Validation for user updates
  - `GetUsersQueryDto` - Pagination query parameters

## API Endpoints

All endpoints require JWT authentication and are prefixed with `/api/users`.

### 1. Get All Users

```
GET /api/users?page=1&limit=10
```

Returns paginated list of users (admin only).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### 2. Get Current User

```
GET /api/users/me
```

Returns the authenticated user's profile.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 3. Get User by ID

```
GET /api/users/:id
```

Returns a specific user by ID (admin only).

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 4. Create User

```
POST /api/users
```

Creates a new user (admin only).

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "Password@123",
  "name": "New User",
  "role": "USER"
}
```

**Validation Rules:**

- `email`: Required, must be valid email
- `password`: Required, minimum 8 characters
- `name`: Optional
- `role`: Optional, must be "USER" or "ADMIN" (default: "USER")

**Response:**

```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "name": "New User",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 5. Update User

```
PUT /api/users/:id
```

Updates a user's information (admin only).

**Request Body:**

```json
{
  "email": "updated@example.com",
  "password": "NewPassword@123",
  "name": "Updated Name",
  "role": "ADMIN"
}
```

All fields are optional. Password will be hashed before storage.

**Response:**

```json
{
  "id": "uuid",
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "ADMIN",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 6. Delete User

```
DELETE /api/users/:id
```

Deletes a user (admin only).

**Response:** 204 No Content

## Security

- All endpoints require JWT authentication via `JwtAuthGuard`
- Most endpoints require admin role (to be implemented with role guard)
- Passwords are hashed using bcryptjs with salt rounds of 10
- User passwords are never exposed in responses

## Error Handling

The module uses standard HTTP status codes:

- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `404 Not Found` - User not found
- `409 Conflict` - Email already exists

## Database Schema

The module uses the `users` table from Prisma schema:

```prisma
model User {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email        String    @unique
  passwordHash String    @map("password_hash")
  name         String?
  role         String?   @default("user")
  createdAt    DateTime? @default(now()) @map("created_at")
  updatedAt    DateTime? @default(now()) @updatedAt @map("updated_at")
  posts        Post[]
}
```

## Future Enhancements

- Add role-based authorization guard
- Add user search and filtering
- Add user profile image upload
- Add email verification
- Add password reset functionality
- Add user activity logging
- Add soft delete capability
