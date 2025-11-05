import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '@modules/posts/domain/repositories/post.repository.interface';
import { PostTranslation } from '@modules/posts/domain/entities/post.entity';

export interface CreateTranslationDto {
  locale: string;
  title: string;
  excerpt?: string;
  content: string;
}

@Injectable()
export class CreateTranslationUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
  ) {}

  async execute(postId: string, dto: CreateTranslationDto): Promise<PostTranslation> {
    // Verify post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const translation = PostTranslation.create({
      postId,
      locale: dto.locale,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
    });

    return await this.postRepository.saveTranslation(translation);
  }
}
