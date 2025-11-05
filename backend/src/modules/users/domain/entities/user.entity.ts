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
    id?: string;
    email: string;
    passwordHash: string;
    name?: string;
    role?: 'USER' | 'ADMIN';
  }): User {
    return new User(
      data.id || crypto.randomUUID(),
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

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
