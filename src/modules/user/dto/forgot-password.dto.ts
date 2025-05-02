import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'İstifadəçi email adresi' })
  @IsEmail()
  email: string;
} 