import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateLanguageDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Dil kodu',
    example: 'az',
    required: false
  })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Dil adı',
    example: 'Azerbaycan',
    required: false
  })
  name?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   description: 'Dilin öz adı',
  //   example: 'Azərbaycan',
  //   required: false
  // })
  // nativeName?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Varsayılan dil mi?',
    example: false,
    required: false
  })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Aktiv dil mi?',
    example: true,
    required: false
  })
  isActive?: boolean;
} 