import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OperationType } from 'types';

export class NewOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(OperationType)
  @IsNotEmpty()
  operationType: OperationType;
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
export class UpdateOperationDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsNumber()
  @IsOptional()
  value: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsEnum(OperationType)
  operationType: OperationType;
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
