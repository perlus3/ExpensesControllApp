import { IsNotEmpty, IsString } from 'class-validator';
export class ConfirmUserTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
