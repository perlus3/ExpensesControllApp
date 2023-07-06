import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './helpers/auth/jwt.strategy';
import { AuthController } from './controllers/auth/auth.controller';
import { AccountsModule } from './accountsModule/accounts.module';
import { MailsModule } from './mails/mails.module';
import { EmailConfirmationService } from './emailConfirmation/emailConfirmation.service';
import { EmailConfirmationController } from './emailConfirmation/emailConfirmation.controller';
import JwtAuthGuard from './helpers/auth/jwt-auth.guard';

@Module({
  imports: [...TypeormImports, AccountsModule, MailsModule],
  controllers: [AuthController, EmailConfirmationController],
  providers: [
    UsersService,
    AuthService,
    EmailConfirmationService,
    JwtStrategy,
    JwtAuthGuard.GlobalProtected(),
  ],
})
export class AppModule {}
