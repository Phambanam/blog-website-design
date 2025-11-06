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
  tagIds?: string[]; // Array of tag IDs to associate with the post
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

    const updatedPost = await this.postRepository.update(id, dto);

    // Update tags if provided
    if (dto.tagIds !== undefined) {
      await this.postRepository.setPostTags(id, dto.tagIds);
    }

    return updatedPost;
  }
}
