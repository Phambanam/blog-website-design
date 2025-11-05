import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '@modules/tags/domain/repositories/tag.repository.interface';
import { Tag } from '@modules/tags/domain/entities/tag.entity';

export interface CreateTagDto {
  name: string;
  slug: string;
}

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private tagRepository: ITagRepository,
  ) {}

  async execute(dto: CreateTagDto): Promise<Tag> {
    // Check if tag with slug already exists
    const existingTag = await this.tagRepository.findBySlug(dto.slug);
    if (existingTag) {
      throw new ConflictException(`Tag with slug "${dto.slug}" already exists`);
    }

    const tag = Tag.create({
      name: dto.name,
      slug: dto.slug,
    });

    return await this.tagRepository.save(tag);
  }
}
