import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { RegisterUserDto } from '../../dtos/registerUser.dto';
import { Response } from 'express';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserLoginDto } from 'src/dtos/userLogin.dto';
import { Public } from '../../helpers/auth/jwt-auth.guard';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokensEntity } from '../../entities/refresh-tokens.entity';
import { Repository } from 'typeorm';
import JwtRefreshGuard from '../../helpers/auth/jwt.refreshGuard';
import { AccountsService } from '../../accountsModule/accounts/accounts.service';
import { EmailConfirmationService } from '../../emailConfirmation/emailConfirmation.service';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private refreshTokens: Repository<RefreshTokensEntity>,
    private accountsService: AccountsService,
    private usersService: UsersService,
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() registerData: RegisterUserDto) {
    const user = await this.usersService.register(registerData);
    const findUser = await this.usersService.findOneByEmail(registerData.email);

    if (findUser) {
      await this.emailConfirmationService.sendVerificationLink(
        registerData.email,
        findUser.id,
      );
    }

    return user;
  }

  @Public()
  @Post('login')
  async login(@Body() body: UserLoginDto, @Res() response: Response) {
    const validateUser = await this.usersService.getAuthenticatedUserFromDb(
      body.login,
      body.password,
    );

    if (!validateUser) {
      throw new UnauthorizedException('invalid credentials');
    }
    const tokens = this.authService.createAccessAndRefreshTokens(validateUser);

    const activeRefreshTokenFromDb =
      await this.authService.getRefreshTokenFromDb(validateUser.id);

    if (
      !activeRefreshTokenFromDb ||
      activeRefreshTokenFromDb.isActive === false
    ) {
      await this.authService.saveRefreshTokenIntoDb(
        validateUser.id,
        tokens.refreshToken,
      );
    }

    response.cookie('AccessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    });
    response.cookie('RefreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 720,
    });

    response.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: validateUser,
    });
  }

  /**
   *  /refresh tworzy nowy accessTokenCookie
   *  jeśli refreshTokenCookie istnieje i
   *  matchuje do tego w bazie danych
   */
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const AccessToken =
      await this.authService.createAccessTokenFromRefreshToken(
        request.cookies.RefreshToken,
      );

    request.res.cookie('AccessToken', AccessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    });

    request.res.setHeader('AccessToken', AccessToken);
    return AccessToken;
  }

  /**
   * /log-out usuwa ciasteczka co powoduje wyrzucenie użytkownika z sesji
   */
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() req: RequestWithUser) {
    await this.authService.removeRefreshTokenFromDb(req.user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return 'WYLOGOWANO';
  }
}
