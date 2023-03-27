import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Currency, OperationType } from 'types';

export class NewOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(OperationType)
  operationType: OperationType;
}
export class UpdateOperationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  value: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsEnum(OperationType)
  operationType: OperationType;
  @IsOptional()
  @IsEnum(Currency)
  currency: Currency;
}
