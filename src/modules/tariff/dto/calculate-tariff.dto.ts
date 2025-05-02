import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CalculatePriceDto {
  @ApiProperty({ 
    description: 'Kargo ağırlığı (kg)', 
    example: 5.5 
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({ 
    description: 'Tarifə ID', 
    example: 1 
  })
  @IsNotEmpty()
  @IsNumber()
  tariffId: number;
  
  @ApiProperty({ 
    description: 'Məsafə (km, istəyə bağlı)', 
    example: 150,
    required: false
  })
  @IsOptional()
  @IsNumber()
  distance?: number;
}