# Docker PostgreSQL Setup

This guide will help you set up PostgreSQL using Docker for local development.

## Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker and PostgreSQL

## Quick Start

1. **Copy the environment file**
   ```bash
   cp .env.example .env
   ```

2. **Start the PostgreSQL container**
   ```bash
   docker-compose up -d
   ```

3. **Verify the database is running**
   ```bash
   docker-compose ps
   ```

4. **Check database logs**
   ```bash
   docker-compose logs postgres
   ```

## Services

The Docker Compose setup includes two services:

### PostgreSQL Database
- **Port**: 5432
- **Container Name**: blog_postgres
- **Database**: blog_db
- **User**: blog_user
- **Password**: blog_password (change in `.env`)

### PgAdmin (Database Management UI)
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin

## Environment Variables

Update the `.env` file with your desired configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://blog_user:blog_password@localhost:5432/blog_db
POSTGRES_USER=blog_user
POSTGRES_PASSWORD=blog_password
POSTGRES_DB=blog_db

# NextAuth/Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# Application
NODE_ENV=development
```

## Database Schema

The database is automatically initialized with:
- `users` table - For authentication
- `posts` table - For blog posts
- `tags` table - For post tags
- `post_tags` table - Junction table for many-to-many relationship

### Default Admin User

A default admin user is created on initialization:
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password in production!

## Useful Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (deletes all data)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker exec -it blog_postgres psql -U blog_user -d blog_db
```

### Restart services
```bash
docker-compose restart
```

## Connecting to PgAdmin

1. Open http://localhost:5050 in your browser
2. Login with:
   - Email: admin@admin.com
   - Password: admin
3. Add a new server:
   - **General Tab**:
     - Name: Blog Database
   - **Connection Tab**:
     - Host: postgres (use container name, not localhost)
     - Port: 5432
     - Maintenance database: blog_db
     - Username: blog_user
     - Password: blog_password

## Troubleshooting

### Port 5432 already in use
If you have PostgreSQL already running on your machine:
```bash
# Stop local PostgreSQL service
sudo systemctl stop postgresql  # Linux
brew services stop postgresql   # macOS

# Or change the port in docker-compose.yml
ports:
  - "5433:5432"  # Use port 5433 on host
```

### Database connection issues
1. Ensure Docker containers are running: `docker-compose ps`
2. Check logs for errors: `docker-compose logs postgres`
3. Verify environment variables in `.env`
4. Try restarting: `docker-compose restart`

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

## Next Steps

1. Update your application to use the new `DATABASE_URL`
2. Replace Supabase client with a PostgreSQL client (e.g., `pg`, `prisma`, or `drizzle`)
3. Implement authentication using NextAuth.js or similar
4. Test your application with the local database

## Security Notes

- Change default passwords before deploying to production
- Use strong, unique passwords for database users
- Don't commit `.env` file to version control
- Consider using environment-specific configurations
