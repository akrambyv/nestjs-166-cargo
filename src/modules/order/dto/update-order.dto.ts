import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../order.types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({default: 'robot alət'})
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({default: 15})
  weight?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty({default: 'pending', enum: OrderStatus})
  status?: OrderStatus;
}