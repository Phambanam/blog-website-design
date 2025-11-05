import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';
import { Post } from '@modules/posts/domain/entities/post.entity';

@Injectable()
export class PublishPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(id: string): Promise<Post> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return await this.postRepository.update(id, { status: 'PUBLISHED' });
  }
}
