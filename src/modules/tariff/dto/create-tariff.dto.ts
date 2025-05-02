import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTariffDto {
  @ApiProperty({ 
    description: 'Tarifə adı', 
    example: 'Standart Təslimat' 
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Tarifə açıqlaması', 
    example: '3-5 iş günü içində təslimat' 
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Təməl qiymət (AZN)', 
    example: 25.00 
  })
  @IsNotEmpty()
  @IsNumber()
  basePrice: number;

  @ApiProperty({ 
    description: 'Kiloqram başına əlavə qiymət (AZN)', 
    example: 5.50 
  })
  @IsNotEmpty()
  @IsNumber()
  pricePerKg: number;

  @ApiProperty({ 
    description: 'Tarifə aktiv edilib?', 
    example: true,
    default: true 
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
}