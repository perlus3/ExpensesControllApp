import { IsOptional, IsString } from 'class-validator';

export class FilterOperationsDto {
  @IsString()
  @IsOptional()
  startDate: string;
  @IsString()
  @IsOptional()
  endDate: string;
}
