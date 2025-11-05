# NestJS Backend Implementation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pnpm install

# Additional required packages
pnpm add @nestjs/swagger swagger-ui-express
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add @nestjs/config
pnpm add @prisma/client
pnpm add bcryptjs class-validator class-transformer
pnpm add -D @types/bcryptjs @types/passport-jwt prisma

# Initialize Prisma
npx prisma generate
npx prisma migrate dev --name init
```

### 2. Project Structure to Create

```bash
# Create directories
mkdir -p src/{common/{decorators,filters,guards,interceptors,pipes},config,modules/{auth,posts,users,tags}/{application/{services,use-cases},domain/{entities,repositories,value-objects},infrastructure/{persistence/{prisma,repositories},adapters},presentation/{controllers,dtos,mappers}},shared/{database,interfaces}}

mkdir -p test/{e2e,unit}
```

### 3. Configuration Files

#### `backend/.env`
```env
# Database
DATABASE_URL="postgresql://blog_user:blog_password@localhost:5433/blog_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"
```

#### `backend/tsconfig.json` (update paths)
```json
{
  "compilerOptions": {
    // ... existing config
    "paths": {
      "@/*": ["./src/*"],
      "@common/*": ["./src/common/*"],
      "@config/*": ["./src/config/*"],
      "@modules/*": ["./src/modules/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

## Step-by-Step Implementation

### STEP 1: Shared Infrastructure

#### `src/shared/database/prisma.service.ts`
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

#### `src/config/database.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));
```

#### `src/config/jwt.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
```

### STEP 2: Common Utilities

#### `src/common/decorators/current-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

#### `src/common/guards/jwt-auth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### `src/common/filters/http-exception.filter.ts`
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### STEP 3: Auth Module (Complete Example)

#### Domain Layer

**`src/modules/auth/domain/entities/user.entity.ts`**
```typescript
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private readonly passwordHash: string,
    public readonly name: string | null,
    public readonly role: 'USER' | 'ADMIN',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    email: string;
    passwordHash: string;
    name?: string;
    role?: 'USER' | 'ADMIN';
  }): User {
    return new User(
      crypto.randomUUID(),
      data.email,
      data.passwordHash,
      data.name || null,
      data.role || 'USER',
      new Date(),
      new Date(),
    );
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}
```

**`src/modules/auth/domain/repositories/user.repository.interface.ts`**
```typescript
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
```

#### Infrastructure Layer

**`src/modules/auth/infrastructure/persistence/repositories/prisma-user.repository.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { IUserRepository } from '@modules/auth/domain/repositories/user.repository.interface';
import { User } from '@modules/auth/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.getPasswordHash(),
        name: user.name,
        role: user.role,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.name,
      prismaUser.role,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
```

#### Application Layer

**`src/modules/auth/application/use-cases/register.use-case.ts`**
```typescript
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '@modules/auth/domain/repositories/user.repository.interface';
import { User } from '@modules/auth/domain/entities/user.entity';

export class RegisterDto {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user entity
    const user = User.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    // Save to database
    return await this.userRepository.save(user);
  }
}
```

**`src/modules/auth/application/use-cases/login.use-case.ts`**
```typescript
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '@modules/auth/domain/repositories/user.repository.interface';

export class LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<{ accessToken: string; user: any }> {
    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(dto.password, user.getPasswordHash());
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
```

#### Presentation Layer

**`src/modules/auth/presentation/dtos/register.dto.ts`**
```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
```

**`src/modules/auth/presentation/controllers/auth.controller.ts`**
```typescript
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { RegisterRequestDto } from '../dtos/register.dto';
import { LoginRequestDto } from '../dtos/login.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterRequestDto) {
    const user = await this.registerUseCase.execute(dto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginRequestDto) {
    return await this.loginUseCase.execute(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
```

**`src/modules/auth/auth.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@shared/database/prisma.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
```

### STEP 4: Main Application Setup

**`src/main.ts`**
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('RESTful API for blog application with i18n support')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
```

**`src/app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
// import { PostsModule } from './modules/posts/posts.module';
// import { UsersModule } from './modules/users/users.module';
// import { TagsModule } from './modules/tags/tags.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    AuthModule,
    // PostsModule,
    // UsersModule,
    // TagsModule,
  ],
})
export class AppModule {}
```

## Running the Application

```bash
# Development
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod

# Run tests
pnpm run test
pnpm run test:e2e
```

## Next Implementation Steps

1. ✅ Auth Module (example above)
2. 🔄 Posts Module (similar structure)
3. 🔄 Users Module
4. 🔄 Tags Module
5. 🔄 Add pagination
6. 🔄 Add caching (Redis)
7. 🔄 Add rate limiting
8. 🔄 Complete test coverage

## Docker Compose for Full Stack

See `docker-compose.yml` in root directory for complete setup with frontend + backend + database.

---

**Status**: Foundation Complete
**Next**: Implement Posts module following Auth module pattern
