import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Dil kodu',
    example: 'az'
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Dil adı',
    example: 'Azerbaycan'
  })
  name: string;

  // @IsNotEmpty()
  // @IsString()
  // @ApiProperty({
  //   description: 'Dilin öz adı',
  //   example: 'Azərbaycan'
  // })
  // nativeName: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Varsayılan dil mi?',
    example: false,
    default: false
  })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Aktiv dil mi?',
    example: true,
    default: true
  })
  isActive?: boolean;
} 