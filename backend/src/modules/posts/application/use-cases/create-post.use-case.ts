import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';
import { Post } from '@modules/posts/domain/entities/post.entity';

export interface CreatePostDto {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  status?: 'DRAFT' | 'PUBLISHED';
  readTime?: number;
  tableOfContents?: any;
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(dto: CreatePostDto): Promise<Post> {
    const post = Post.create({
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      featuredImage: dto.featuredImage,
      authorId: dto.authorId,
      status: dto.status || 'DRAFT',
      readTime: dto.readTime,
      tableOfContents: dto.tableOfContents,
    });

    return await this.postRepository.save(post);
  }
}
