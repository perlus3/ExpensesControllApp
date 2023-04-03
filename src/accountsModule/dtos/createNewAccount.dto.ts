import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from 'types';

export class CreateNewAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsDecimal()
  @IsNotEmpty()
  value: number;
  @IsOptional()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
