import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../helpers/auth/jwt-auth.guard';
import { JwtStrategy } from '../helpers/auth/jwt.strategy';
import { RequestWithUser } from '../helpers/auth/auth.interface';
import { ConfirmUserTokenDto } from '../dtos/confirmUserToken.dto';
import { EmailConfirmationService } from './emailConfirmation.service';

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
  @UseGuards(JwtStrategy)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.sendVerificationLink(
      request.user.email,
      request.user.id,
    );
  }
}
