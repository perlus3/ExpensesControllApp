import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './helpers/auth/jwt.strategy';
import { JwtRefreshTokenStrategy } from './helpers/auth/jwt.refreshToken.strategy';
import JwtRefreshGuard from './helpers/auth/jwt.refreshGuard';
import JwtAuthGuard from './helpers/auth/jwt-auth.guard';
import { AuthController } from './controllers/auth/auth.controller';
import { AccountsModule } from './accountsModule/accounts.module';
import { UserController } from './controllers/users/user.controller';

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
