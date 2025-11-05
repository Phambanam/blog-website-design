import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { User } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { skip?: number; take?: number }): Promise<{ users: User[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 10;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((user) => this.toDomain(user)),
      total,
    };
  }

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

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const updateData: any = {};
    
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role.toLowerCase();
    if ('passwordHash' in data) {
      const user = data as any;
      if (user.passwordHash) updateData.passwordHash = user.passwordHash;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
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
