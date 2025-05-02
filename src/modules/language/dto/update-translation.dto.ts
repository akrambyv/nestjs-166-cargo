import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTranslationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Tərcümə dəyəri',
    example: 'Xoş gəlmisiniz',
    required: false
  })
  value?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   description: 'Tərcümə qrupu',
  //   example: 'common',
  //   required: false
  // })
  // group?: string;
} 