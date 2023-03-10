import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OperationType } from '../../entities/cash-flow.entity';

export class NewOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(OperationType)
  operationType: OperationType;
}
