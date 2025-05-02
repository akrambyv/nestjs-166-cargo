import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTranslationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Tərcümə açarı',
    example: 'welcome'
  })
  key: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Tərcümə dəyəri',
    example: 'Xoş gəlmisiniz'
  })
  value: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   description: 'Tərcümə qrupu',
  //   example: 'common',
  //   required: false
  // })
  // group?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Dil ID',
    example: 1
  })
  languageId: number;
} 