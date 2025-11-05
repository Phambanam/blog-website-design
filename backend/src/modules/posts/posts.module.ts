import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { PostsController } from './presentation/controllers/posts.controller';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { GetPostUseCase } from './application/use-cases/get-post.use-case';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { PublishPostUseCase } from './application/use-cases/publish-post.use-case';
import { CreateTranslationUseCase } from './application/use-cases/create-translation.use-case';
import { GetTranslationsUseCase } from './application/use-cases/get-translations.use-case';
import { DeleteTranslationUseCase } from './application/use-cases/delete-translation.use-case';
import { PrismaPostRepository } from './infrastructure/persistence/repositories/prisma-post.repository';
import { POST_REPOSITORY } from './domain/repositories/post.repository.interface';

@Module({
  controllers: [PostsController],
  providers: [
    PrismaService,
    {
      provide: POST_REPOSITORY,
      useClass: PrismaPostRepository,
    },
    GetPostsUseCase,
    GetPostUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    PublishPostUseCase,
    CreateTranslationUseCase,
    GetTranslationsUseCase,
    DeleteTranslationUseCase,
  ],
  exports: [POST_REPOSITORY],
})
export class PostsModule {}
