import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class UpdateTariffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  pricePerKg?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}