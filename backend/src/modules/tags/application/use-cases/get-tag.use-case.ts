import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '@modules/tags/domain/repositories/tag.repository.interface';
import { Tag } from '@modules/tags/domain/entities/tag.entity';

@Injectable()
export class GetTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private tagRepository: ITagRepository,
  ) {}

  async execute(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }
}
