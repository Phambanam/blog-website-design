import { IsString, IsOptional, IsEnum, IsNumber, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostRequestDto {
  @ApiProperty({ example: 'Introduction to NestJS' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Learn the basics of NestJS framework' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ example: 'draft', enum: ['draft', 'published'] })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: 'draft' | 'published';

  @ApiPropertyOptional({ example: 5 })
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
