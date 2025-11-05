import { Injectable, Inject } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '@modules/tags/domain/repositories/tag.repository.interface';
import { Tag } from '@modules/tags/domain/entities/tag.entity';

@Injectable()
export class GetTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private tagRepository: ITagRepository,
  ) {}

  async execute(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }
}
