import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { AuthPayloadJWT } from './auth.interface';
import { RefreshTokensEntity } from '../../entities/refresh-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private refreshTokens: Repository<RefreshTokensEntity>,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshTokenStrategy.extractJWT,
      ]),
      secretOrKey: authService.secretKey,
      passReqToCallback: true,
    });
  }
  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'RefreshToken' in req.cookies &&
      req.cookies.RefreshToken.length > 0
    ) {
      return req.cookies.RefreshToken;
    }
    return null;
  }

  /**
   *  strategia ktora sprawdza czy jest refreshTokenCookie i czy matchuje do tego w bazie danych
   *  jeśli matchuje to zwraca usera, a potem jest tworzony nowy AccessTokenCookie w endpoincie users/refresh
   */

  async validate(request: Request, payload: AuthPayloadJWT) {
    const refreshToken = request.cookies?.RefreshToken;
    console.log(refreshToken);
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.user.id,
    );
  }
}

//@Todo jak sie loguje to tworze token zapisuje do bazy danych i do ciastka, jak sie wyloguje to usuwam ciastka i token z bazy danych wiec gdy zaloguje sie to moge zrobic refreshToken bo tokeny ten z ciastek i z bazy sie zgadzaja, ale jak zaloguje się dwa razy to token istnieje w bazie wiec sie nie zapisuje, a token z ciastka sie zapisuje wiec nie moge zrobic refreshtoken bo tokeny się różnią więc PRAKTYCZNIE działa bo nikt nie bedzie logowal sie dwa razy (bez uprzedniego wylogowania się)
