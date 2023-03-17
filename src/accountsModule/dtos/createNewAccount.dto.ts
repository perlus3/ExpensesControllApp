import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from 'src/entities/accounts.entity';

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
  @IsNumber()
  @IsNotEmpty()
  value: number;
  @IsOptional()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
