import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '@modules/tags/domain/repositories/tag.repository.interface';

@Injectable()
export class GetPostsByTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private tagRepository: ITagRepository,
  ) {}

  async execute(slug: string, locale?: string): Promise<any[]> {
    // Verify tag exists
    const tag = await this.tagRepository.findBySlug(slug);
    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return await this.tagRepository.getPostsByTag(slug, locale);
  }
}
