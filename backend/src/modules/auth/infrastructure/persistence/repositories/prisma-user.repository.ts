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
        email: user.email,
        passwordHash: user.getPasswordHash(),
        name: user.name,
        role: user.role.toLowerCase(),
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
      (prismaUser.role?.toUpperCase() || 'USER') as 'USER' | 'ADMIN',
      prismaUser.createdAt || new Date(),
      prismaUser.updatedAt || new Date(),
    );
  }
}
