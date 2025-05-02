import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContentDto {
  @ApiProperty({
    description: 'Məzmun başlığı',
    example: 'Haqqımızda'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'HTML və ya düz mətn məzmun',
    example: '<p>166 Cargo, güvənilir kargo şirkəti!</p>'
  })
  @IsOptional()
  @IsString()
  content?: string;
}
