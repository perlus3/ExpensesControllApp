import { IsOptional, IsString } from 'class-validator';

export class FilterOperationsDto {
  @IsString()
  @IsOptional()
  year: string;
  @IsString()
  @IsOptional()
  month: string;
}
