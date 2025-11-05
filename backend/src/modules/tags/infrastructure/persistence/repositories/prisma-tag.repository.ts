import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { ITagRepository } from '@modules/tags/domain/repositories/tag.repository.interface';
import { Tag } from '@modules/tags/domain/entities/tag.entity';

@Injectable()
export class PrismaTagRepository implements ITagRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return tags.map(t => this.toDomain(t));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    return tag ? this.toDomain(tag) : null;
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { slug } });
    return tag ? this.toDomain(tag) : null;
  }

  async save(tag: Tag): Promise<Tag> {
    const created = await this.prisma.tag.create({
      data: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      },
    });
    return this.toDomain(created);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }

  async getPostsByTag(slug: string, locale?: string): Promise<any[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        post_tags: {
          some: {
            tags: { slug },
          },
        },
      },
      include: {
        translations: locale ? {
          where: { locale },
        } : true,
        post_tags: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(p => {
      const translation = locale && Array.isArray(p.translations) ? p.translations.find(t => t.locale === locale) : undefined;
      return {
        id: p.id,
        title: translation?.title || p.title,
        excerpt: translation?.excerpt || p.excerpt,
        content: translation?.content || p.content,
        featuredImage: p.featuredImage,
        authorId: p.authorId,
        status: p.status?.toUpperCase(),
        readTime: p.readTime,
        tableOfContents: p.tableOfContents,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        tags: p.post_tags?.map(pt => ({
          id: pt.tags.id,
          name: pt.tags.name,
          slug: pt.tags.slug,
        })),
      };
    });
  }

  private toDomain(prismaTag: any): Tag {
    return new Tag(
      prismaTag.id,
      prismaTag.name,
      prismaTag.slug,
      prismaTag.createdAt || new Date(),
      prismaTag.updatedAt || new Date(),
    );
  }
}
