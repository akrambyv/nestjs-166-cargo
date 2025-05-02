import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class FindTariffsDto {
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    minPrice?: number;
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;
    
  }