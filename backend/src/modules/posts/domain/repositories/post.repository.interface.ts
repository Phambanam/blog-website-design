import { Post, PostTranslation } from '../entities/post.entity';

export interface IPostRepository {
  findAll(locale: string, status?: string): Promise<Post[]>;
  findById(id: string, locale?: string): Promise<Post | null>;
  save(post: Post): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;

  // Translation methods
  saveTranslation(translation: PostTranslation): Promise<PostTranslation>;
  getTranslations(postId: string): Promise<PostTranslation[]>;
  deleteTranslation(postId: string, locale: string): Promise<void>;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
