import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(params?: { skip?: number; take?: number }): Promise<{ users: User[]; total: number }>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
