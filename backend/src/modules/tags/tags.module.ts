import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { TagsController } from './presentation/controllers/tags.controller';
import { GetTagsUseCase } from './application/use-cases/get-tags.use-case';
import { GetTagUseCase } from './application/use-cases/get-tag.use-case';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { GetPostsByTagUseCase } from './application/use-cases/get-posts-by-tag.use-case';
import { PrismaTagRepository } from './infrastructure/persistence/repositories/prisma-tag.repository';
import { TAG_REPOSITORY } from './domain/repositories/tag.repository.interface';

@Module({
  controllers: [TagsController],
  providers: [
    PrismaService,
    {
      provide: TAG_REPOSITORY,
      useClass: PrismaTagRepository,
    },
    GetTagsUseCase,
    GetTagUseCase,
    CreateTagUseCase,
    GetPostsByTagUseCase,
  ],
  exports: [TAG_REPOSITORY],
})
export class TagsModule {}
