import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthSignInDto {
    @Type()
    @IsString()
    @IsEmail()
    @ApiProperty({ default: 'abyvkrm2004@gmail.com' })
    email: string;

    @Type()
    @IsString()
    @MinLength(6)
    @ApiProperty({ default: 'Ee123456' })
    password: string;
}