import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '@modules/users/domain/repositories/user.repository.interface';
import { User } from '@modules/users/domain/entities/user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
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
      role: dto.role || 'USER',
    });

    // Save to database
    return await this.userRepository.save(user);
  }
}
