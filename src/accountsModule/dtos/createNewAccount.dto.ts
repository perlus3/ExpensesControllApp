import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Currency } from 'src/entities/accounts.entity';

export class CreateNewAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  value: number;
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
