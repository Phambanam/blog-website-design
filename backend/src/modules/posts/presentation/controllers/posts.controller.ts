import { Controller, Get, Post, Put, Delete, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetPostsUseCase } from '@modules/posts/application/use-cases/get-posts.use-case';
import { GetPostUseCase } from '@modules/posts/application/use-cases/get-post.use-case';
import { CreatePostUseCase } from '@modules/posts/application/use-cases/create-post.use-case';
import { UpdatePostUseCase } from '@modules/posts/application/use-cases/update-post.use-case';
import { DeletePostUseCase } from '@modules/posts/application/use-cases/delete-post.use-case';
import { PublishPostUseCase } from '@modules/posts/application/use-cases/publish-post.use-case';
import { CreateTranslationUseCase } from '@modules/posts/application/use-cases/create-translation.use-case';
import { GetTranslationsUseCase } from '@modules/posts/application/use-cases/get-translations.use-case';
import { DeleteTranslationUseCase } from '@modules/posts/application/use-cases/delete-translation.use-case';
import { CreatePostRequestDto } from '../dtos/create-post.dto';
import { UpdatePostRequestDto } from '../dtos/update-post.dto';
import { CreateTranslationRequestDto } from '../dtos/create-translation.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private getPostsUseCase: GetPostsUseCase,
    private getPostUseCase: GetPostUseCase,
    private createPostUseCase: CreatePostUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase,
    private publishPostUseCase: PublishPostUseCase,
    private createTranslationUseCase: CreateTranslationUseCase,
    private getTranslationsUseCase: GetTranslationsUseCase,
    private deleteTranslationUseCase: DeleteTranslationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'locale', required: false, example: 'en' })
  @ApiQuery({ name: 'status', required: false, example: 'published' })
  async getPosts(
    @Query('locale') locale: string = 'en',
    @Query('status') status?: string,
  ) {
    return await this.getPostsUseCase.execute(locale, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiQuery({ name: 'locale', required: false, example: 'en' })
  async getPost(
    @Param('id') id: string,
    @Query('locale') locale?: string,
  ) {
    return await this.getPostUseCase.execute(id, locale);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new post (admin only)' })
  async createPost(
    @Body() dto: CreatePostRequestDto,
    @CurrentUser() user: any,
  ) {
    return await this.createPostUseCase.execute({
      ...dto,
      authorId: user.userId,
      status: dto.status ? dto.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' : 'DRAFT',
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post (admin only)' })
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostRequestDto,
  ) {
    return await this.updatePostUseCase.execute(id, {
      ...dto,
      status: dto.status ? dto.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' : undefined,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post (admin only)' })
  async deletePost(@Param('id') id: string) {
    await this.deletePostUseCase.execute(id);
    return { message: 'Post deleted successfully' };
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish post (admin only)' })
  async publishPost(@Param('id') id: string) {
    return await this.publishPostUseCase.execute(id);
  }

  @Get(':id/translations')
  @ApiOperation({ summary: 'Get all translations for a post' })
  async getTranslations(@Param('id') id: string) {
    return await this.getTranslationsUseCase.execute(id);
  }

  @Post(':id/translations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add or update translation (admin only)' })
  async createTranslation(
    @Param('id') id: string,
    @Body() dto: CreateTranslationRequestDto,
  ) {
    return await this.createTranslationUseCase.execute(id, dto);
  }

  @Delete(':id/translations/:locale')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete translation (admin only)' })
  async deleteTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
  ) {
    await this.deleteTranslationUseCase.execute(id, locale);
    return { message: 'Translation deleted successfully' };
  }
}
