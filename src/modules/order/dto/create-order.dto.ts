import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({default: 'Elektrikli tozsoran'})
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({default: 15})
  weight: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({default: 500, required: false})
  price?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({description: 'Tarife ID', example: 1})
  tariffId: number;
}