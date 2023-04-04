import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OperationType } from '../../../types';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(OperationType)
  @IsNotEmpty()
  type: OperationType;
}
