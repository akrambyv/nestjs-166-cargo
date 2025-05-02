import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({
    description: 'Məzmun açarı',
    example: 'about-us'
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Məzmun başlığı',
    example: 'Haqqımızda'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'HTML və ya düz mətn məzmun',
    example: '<p>166 Cargo, güvənilir kargo şirkəti!</p>'
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}