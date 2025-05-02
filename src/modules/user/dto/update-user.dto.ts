import { IsOptional, IsString, IsEmail, IsEnum, IsDate, MinLength } from 'class-validator';
import { Gender } from '../user.types';
// import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Ad',
        example: 'Ekrem',
        required: false
    })
    firstName?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Soyad',
        example: 'Abiyev',
        required: false
    })
    lastName?: string;
  
    @IsOptional()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        example: 'abyvkrm2004@gmail.com',
        required: false
    })
    email?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'Şifrə',
        example: 'password123',
        required: false
    })
    password?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({
    //     description: 'Telefon nömrəsi',
    //     example: '+994501234567',
    //     required: false
    // })
    // phoneNumber?: string;
  
    // @IsOptional()
    // @IsEnum(Gender)
    // @ApiProperty({
    //     description: 'Cins',
    //     enum: Gender,
    //     example: Gender.MALE,
    //     required: false
    // })
    // gender?: Gender;
  
    // @IsOptional()
    // @IsDate()
    // @Type(() => Date)
    // @ApiProperty({
    //     description: 'Doğum tarixi',
    //     example: '2004-02-27',
    //     required: false
    // })
    // birthDate?: Date;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({
    //     description: 'Ünvan',
    //     example: 'Bakı şəhəri, Yasamal rayonu',
    //     required: false
    // })
    // address?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({
    //     description: 'Profil şəkli',
    //     example: 'https://example.com/profile.jpg',
    //     required: false
    // })
    // profileImage?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({
    //     description: 'Haqqımda',
    //     example: 'Mən 166 Cargo şirkətinin müştərisiyəm',
    //     required: false
    // })
    // about?: string;
}