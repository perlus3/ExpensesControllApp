import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
  Get,
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

    const { id, email } = user;

    return { id, email };
  }

  @Public()
  @Post('login')
  async login(@Body() body: UserLoginDto, @Res() response: Response) {
    const validateUser = await this.usersService.getAuthenticatedUserFromDb(
      body.login,
      body.password,
    );

    if (!validateUser) {
      throw new UnauthorizedException('Niepoprawne dane logowania!');
    }
    const tokens = this.authService.createAccessAndRefreshTokens(validateUser);

    const activeRefreshTokenFromDb =
      await this.authService.getRefreshTokenFromDb(validateUser.id);

    if (!activeRefreshTokenFromDb) {
      await this.authService.saveRefreshTokenIntoDb(
        validateUser.id,
        tokens.refreshToken,
      );
    }

    response.cookie('AccessToken', tokens.accessToken, {
      maxAge: 1000 * 60 * 5,
      domain: 'localhost',
    });
    response.cookie('RefreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 72,
      domain: 'localhost',
    });

    response.json({
      userId: validateUser.id,
    });
  }

  /**
   *  /refresh tworzy nowy accessTokenCookie
   *  jeśli refreshTokenCookie istnieje i
   *  matchuje do tego w bazie danych
   */

  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    console.log('refresh');
    if (request.cookies.RefreshToken) {
      const AccessToken =
        await this.authService.createAccessTokenFromRefreshToken(
          request.cookies.RefreshToken,
        );

      const response = request.res;
      response.cookie('AccessToken', AccessToken, {
        maxAge: 1000 * 60 * 5,
      });
      return { token: AccessToken };
    }
    return { message: 'RefreshToken Expired' };
  }

  /**
   * /log-out usuwa ciasteczka co powoduje wyrzucenie użytkownika z sesji
   */
  @Public()
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() req: RequestWithUser) {
    req.res.clearCookie('AccessToken');
    req.res.clearCookie('RefreshToken');

    return this.authService.removeTokenByToken(req.cookies.RefreshToken);
  }
}
