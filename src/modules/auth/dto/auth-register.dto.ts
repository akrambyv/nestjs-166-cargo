import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsAlphanumeric, IsEmail, IsEnum, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Gender } from "../../../modules/user/user.types";

export class AuthRegisterDto {
    @Type()
    @IsString()
    @Length(3, 30)
    @IsAlphanumeric()
    @ApiProperty({ default: 'Ekrem' })
    firstName: string;

    @Type()
    @IsString()
    @MinLength(5)
    @ApiProperty({ default: 'Ee123456' })
    password: string;

    @Type()
    @IsString()
    @IsEmail()
    @ApiProperty({ default: 'abyvkrm2004@gmail.com' })
    email: string;

    @Type()
    @IsEnum(Gender)
    @ApiProperty({ 
        enum: Gender,
        default: Gender.MALE,
        description: 'Cins'
    })
    gender: Gender;

    @Type()
    @IsString()
    @IsOptional()
    @Length(3, 30)
    @ApiProperty({ default: 'Abiyev'})
    lastName: string;
}