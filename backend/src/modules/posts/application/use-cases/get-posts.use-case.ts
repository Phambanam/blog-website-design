import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';
import { Post } from '@modules/posts/domain/entities/post.entity';

@Injectable()
export class GetPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(locale: string, status?: string): Promise<Post[]> {
    return await this.postRepository.findAll(locale, status);
  }
}
