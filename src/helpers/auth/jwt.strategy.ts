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
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: authService.secretKey,
      passReqToCallback: true,
    });
  }
  private static extractJWT(req: Request): string | null {
    if (req.cookies) {
      if ('AccessToken' in req.cookies && req.cookies.AccessToken.length > 0) {
        return req.cookies.AccessToken;
      }
      if (
        'RefreshToken' in req.cookies &&
        req.cookies.RefreshToken.length > 0
      ) {
        return req.cookies.RefreshToken;
      }
    }
    return null;
  }

  async validate(req: Request, payload: AuthPayloadJWT): Promise<UsersEntity> {
    const refreshToken = req.cookies?.RefreshToken;
    const accessToken = req.cookies?.AccessToken;
    const tokenFromDb = await this.authService.getRefreshTokenFromDb(
      payload.user.id,
    );
    if (!refreshToken && accessToken) {
      return this.authService.validateSessionToken(payload);
    }
    if (!tokenFromDb) {
      return null;
    }
    if (tokenFromDb && refreshToken) {
      if (tokenFromDb?.refreshToken !== refreshToken) {
        await this.authService.removeRefreshTokenFromDb(payload.user.id);
        return null;
      }
      await this.authService.checkTokenExpTime(payload.user.id);
    }

    return this.authService.validateSessionToken(payload);
  }
}
