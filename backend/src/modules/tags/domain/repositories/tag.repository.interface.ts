import { Tag } from '../entities/tag.entity';

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
  findBySlug(slug: string): Promise<Tag | null>;
  save(tag: Tag): Promise<Tag>;
  delete(id: string): Promise<void>;
  getPostsByTag(slug: string, locale?: string): Promise<any[]>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');
