import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTranslationRequestDto {
  @ApiProperty({ example: 'en', description: 'Locale code (e.g., en, vi)' })
  @IsString()
  locale: string;

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
}
