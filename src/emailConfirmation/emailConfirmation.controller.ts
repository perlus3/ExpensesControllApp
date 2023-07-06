import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from '../helpers/auth/auth.interface';
import { ConfirmUserTokenDto } from '../dtos/confirmUserToken.dto';
import { EmailConfirmationService } from './emailConfirmation.service';
import { Public } from '../helpers/auth/jwt-auth.guard';

@Controller('email')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Public()
  @Post('confirm-email')
  async confirm(@Body() confirmationData: ConfirmUserTokenDto) {
    const token = await this.emailConfirmationService.checkToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.verifyUser(token);

    return 'Email potwierdzony!';
  }

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.sendVerificationLink(
      request.user.email,
      request.user.id,
    );
  }
}
