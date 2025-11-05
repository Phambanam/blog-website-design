export class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly excerpt: string | null,
    public readonly content: string,
    public readonly featuredImage: string | null,
    public readonly authorId: string,
    public readonly status: 'DRAFT' | 'PUBLISHED',
    public readonly readTime: number | null,
    public readonly tableOfContents: any,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public tags?: any[],
  ) {}

  static create(data: {
    title: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    authorId: string;
    status?: 'DRAFT' | 'PUBLISHED';
    readTime?: number;
    tableOfContents?: any;
  }): Post {
    return new Post(
      crypto.randomUUID(),
      data.title,
      data.excerpt || null,
      data.content,
      data.featuredImage || null,
      data.authorId,
      data.status || 'DRAFT',
      data.readTime || null,
      data.tableOfContents || null,
      new Date(),
      new Date(),
    );
  }
}

export class PostTranslation {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly locale: string,
    public readonly title: string,
    public readonly excerpt: string | null,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    postId: string;
    locale: string;
    title: string;
    excerpt?: string;
    content: string;
  }): PostTranslation {
    return new PostTranslation(
      crypto.randomUUID(),
      data.postId,
      data.locale,
      data.title,
      data.excerpt || null,
      data.content,
      new Date(),
      new Date(),
    );
  }
}
