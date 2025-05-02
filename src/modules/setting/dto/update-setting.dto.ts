import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiProperty({
    description: 'Ayarın yeni dəyəri',
    example: '166 Kargo Şirkəti'
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}