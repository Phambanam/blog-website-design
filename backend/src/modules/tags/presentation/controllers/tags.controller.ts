import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { GetTagsUseCase } from '@modules/tags/application/use-cases/get-tags.use-case';
import { GetTagUseCase } from '@modules/tags/application/use-cases/get-tag.use-case';
import { CreateTagUseCase } from '@modules/tags/application/use-cases/create-tag.use-case';
import { GetPostsByTagUseCase } from '@modules/tags/application/use-cases/get-posts-by-tag.use-case';
import { CreateTagRequestDto } from '../dtos/create-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    private getTagsUseCase: GetTagsUseCase,
    private getTagUseCase: GetTagUseCase,
    private createTagUseCase: CreateTagUseCase,
    private getPostsByTagUseCase: GetPostsByTagUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  async getTags() {
    return await this.getTagsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  async getTag(@Param('id') id: string) {
    return await this.getTagUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new tag (admin only)' })
  async createTag(@Body() dto: CreateTagRequestDto) {
    return await this.createTagUseCase.execute(dto);
  }

  @Get(':slug/posts')
  @ApiOperation({ summary: 'Get posts by tag slug' })
  @ApiQuery({ name: 'locale', required: false, example: 'en' })
  async getPostsByTag(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return await this.getPostsByTagUseCase.execute(slug, locale);
  }
}
