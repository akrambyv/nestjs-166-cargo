import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingStatus } from '../tracking.types';

export class UpdateTrackingDto {
  @IsNotEmpty()
  @IsEnum(ShippingStatus)
  @ApiProperty({
    enum: ShippingStatus,
    example: ShippingStatus.IN_TRANSIT,
  })
  status: ShippingStatus;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Bakı Depo',
  })
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Kargo depoya çatdı və işləmə alındı.',
  })
  description: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2025-04-15T12:00:00Z',
    required: false,
  })
  estimatedDeliveryDate?: Date;
}