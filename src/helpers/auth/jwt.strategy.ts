import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../services/auth/auth.service';
import { AuthPayloadJWT } from './auth.interface';
import { UsersEntity } from '../../entities/users.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authService.secretKey,
    });
  }
  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'AccessToken' in req.cookies &&
      req.cookies.AccessToken.length > 0
    ) {
      return req.cookies.AccessToken;
    }
    return null;
  }
  async validate(payload: AuthPayloadJWT): Promise<UsersEntity> {
    const token = await this.authService.getRefreshTokenFromDb(payload.user.id);
    if (token) {
      await this.authService.checkTokenExpTime(payload.user.id);
    }
    if (!token) {
      console.log('WYLOGUJ UŻYTKOWNIKA! CZEKAMY AZ ACCESSCOOKIE WYGAŚNIE');
    }

    return this.authService.validateSessionToken(payload);
  }
}
