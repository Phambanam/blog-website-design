import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.delete(id);
  }
}
