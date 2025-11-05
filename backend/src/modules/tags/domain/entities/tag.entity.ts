export class Tag {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: { name: string; slug: string }): Tag {
    return new Tag(
      crypto.randomUUID(),
      data.name,
      data.slug,
      new Date(),
      new Date(),
    );
  }
}
