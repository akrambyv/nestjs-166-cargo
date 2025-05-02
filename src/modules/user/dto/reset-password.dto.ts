import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Sıfırlama tokeni' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Yeni şifrə' })
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Şifrə çox sadədir. Ən az bir böyük hərf, bir kiçik hərf və bir rəqəm olmalıdır.',
  })
  newPassword: string;

  @ApiProperty({ description: 'Yeni şifrə təkrarı' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
} 