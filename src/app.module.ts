import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { UserController } from './controllers/users/user.controller';
import { UsersService } from './services/users/users.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './helpers/auth/jwt.strategy';
import JwtAuthGuard from './helpers/auth/jwt-auth.guard';
import JwtRefreshGuard from './helpers/auth/jwt.refreshGuard';
import { JwtRefreshTokenStrategy } from './helpers/auth/jwt.refreshToken.strategy';
import { AccountsModule } from './accountsModule/accounts.module';

@Module({
  imports: [...TypeormImports, AccountsModule],
  controllers: [UserController, AuthController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtRefreshGuard,
    JwtAuthGuard.GlobalProtected(),
  ],
})
export class AppModule {}
