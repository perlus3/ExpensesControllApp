import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OperationType } from 'src/types';
import { CategoriesEntity } from '../../entities/categories.entity';

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
  categoryId: CategoriesEntity['id'];
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
}
