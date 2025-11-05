import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';
import { Post } from '@modules/posts/domain/entities/post.entity';

export interface UpdatePostDto {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  readTime?: number;
  tableOfContents?: any;
}

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(id: string, dto: UpdatePostDto): Promise<Post> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return await this.postRepository.update(id, dto);
  }
}
