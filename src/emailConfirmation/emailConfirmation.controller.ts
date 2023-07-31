import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from '../helpers/auth/auth.interface';
import { ConfirmUserTokenDto } from '../dtos/confirmUserToken.dto';
import { EmailConfirmationService } from './emailConfirmation.service';
import { Public } from '../helpers/auth/jwt-auth.guard';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { UsersService } from '../services/users/users.service';

@Controller('email')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('confirm-email')
  async confirm(@Body() confirmationData: ConfirmUserTokenDto) {
    await this.emailConfirmationService.checkToken(confirmationData.token);
    return { success: 'OK' };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() { email }: Partial<RegisterUserDto>) {
    await this.emailConfirmationService.sendSetNewPasswordEmail(email);
    return { success: 'OK' };
  }

  @Public()
  @Post('set-new-password/:id/:token')
  async setNewPassword(
    @Body() { password }: Partial<RegisterUserDto>,
    @Param('id') userId: string,
    @Param('token') token: string,
  ) {
    await this.emailConfirmationService.validateToken(token);
    await this.usersService.setNewPassword(password, userId);
    return { success: 'OK' };
  }

  @Public()
  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.sendVerificationLink(
      request.user.email,
      request.user.id,
    );
  }
}
