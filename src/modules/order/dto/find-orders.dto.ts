import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class FindOrdersDto {
    @IsString()
    @IsOptional()
    status?: string;
    
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    startDate?: Date;
    
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    endDate?: Date;
    
  }