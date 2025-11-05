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
