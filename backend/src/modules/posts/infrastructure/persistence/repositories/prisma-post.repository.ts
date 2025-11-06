import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { IPostRepository } from '@modules/posts/domain/repositories/post.repository.interface';
import { Post, PostTranslation } from '@modules/posts/domain/entities/post.entity';

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(locale: string, status?: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: status ? { status } : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            // bio: true,
            // avatar: true,
          },
        },
        translations: {
          where: { locale },
        },
        post_tags: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('[BACKEND] First post raw data:', JSON.stringify(posts[0], null, 2));
    console.log('[BACKEND] First post post_tags:', posts[0]?.post_tags);

    return posts.map(p => this.toDomain(p, locale));
  }

  async findById(id: string, locale?: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
          },
        },
        translations: locale ? {
          where: { locale },
        } : true,
        post_tags: {
          include: {
            tags: true,
          },
        },
      },
    });

    return post ? this.toDomain(post, locale) : null;
  }

  async save(post: Post): Promise<Post> {
    const created = await this.prisma.post.create({
      data: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        authorId: post.authorId,
        status: post.status.toLowerCase(),
        readTime: post.readTime,
        tableOfContents: post.tableOfContents,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        status: data.status?.toLowerCase(),
        readTime: data.readTime,
        tableOfContents: data.tableOfContents,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async saveTranslation(translation: PostTranslation): Promise<PostTranslation> {
    const saved = await this.prisma.postTranslation.upsert({
      where: {
        postId_locale: {
          postId: translation.postId,
          locale: translation.locale,
        },
      },
      create: {
        postId: translation.postId,
        locale: translation.locale,
        title: translation.title,
        excerpt: translation.excerpt,
        content: translation.content,
      },
      update: {
        title: translation.title,
        excerpt: translation.excerpt,
        content: translation.content,
      },
    });

    return new PostTranslation(
      saved.id,
      saved.postId,
      saved.locale,
      saved.title,
      saved.excerpt,
      saved.content,
      saved.createdAt || new Date(),
      saved.updatedAt || new Date(),
    );
  }

  async getTranslations(postId: string): Promise<PostTranslation[]> {
    const translations = await this.prisma.postTranslation.findMany({
      where: { postId },
    });

    return translations.map(t => new PostTranslation(
      t.id,
      t.postId,
      t.locale,
      t.title,
      t.excerpt,
      t.content,
      t.createdAt || new Date(),
      t.updatedAt || new Date(),
    ));
  }

  async deleteTranslation(postId: string, locale: string): Promise<void> {
    await this.prisma.postTranslation.delete({
      where: {
        postId_locale: { postId, locale },
      },
    });
  }

  async setPostTags(postId: string, tagIds: string[]): Promise<void> {
    // Delete all existing post-tag associations
    await this.prisma.postTag.deleteMany({
      where: { post_id: postId },
    });

    // Create new associations
    if (tagIds && tagIds.length > 0) {
      await this.prisma.postTag.createMany({
        data: tagIds.map(tagId => ({
          post_id: postId,
          tag_id: tagId,
        })),
      });
    }
  }

  private toDomain(prismaPost: any, locale?: string): Post {
    const translation = locale && prismaPost.translations?.[0];

    const post = new Post(
      prismaPost.id,
      translation?.title || prismaPost.title,
      translation?.excerpt || prismaPost.excerpt,
      translation?.content || prismaPost.content,
      prismaPost.featuredImage,
      prismaPost.authorId,
      (prismaPost.status?.toUpperCase() || 'DRAFT') as 'DRAFT' | 'PUBLISHED',
      prismaPost.readTime,
      prismaPost.tableOfContents,
      prismaPost.createdAt || new Date(),
      prismaPost.updatedAt || new Date(),
    );

    // Add author information if available
    if (prismaPost.author) {
      (post as any).author = {
        id: prismaPost.author.id,
        name: prismaPost.author.name || prismaPost.author.email,
        email: prismaPost.author.email,
        bio: (prismaPost.author as any).bio || null,
        avatar: (prismaPost.author as any).avatar || null,
      };
    }

    // Add tags if available
    if (prismaPost.post_tags) {
      post.tags = prismaPost.post_tags.map((pt: any) => ({
        id: pt.tags.id,
        name: pt.tags.name,
        slug: pt.tags.slug,
      }));
    }

    return post;
  }
}
