import { IsString, IsOptional, IsEnum, IsNumber, IsObject, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostRequestDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated excerpt' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Updated content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-image.jpg' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published'] })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: 'draft' | 'published';

  @ApiPropertyOptional({ example: 7 })
  @IsNumber()
  @IsOptional()
  readTime?: number;

  @ApiPropertyOptional({ example: {} })
  @IsObject()
  @IsOptional()
  tableOfContents?: any;

  @ApiPropertyOptional({ 
    example: ['tag-id-1', 'tag-id-2'],
    description: 'Array of tag IDs to associate with the post',
    type: [String]
  })
  @IsArray()
  @IsOptional()
  tagIds?: string[];
}
