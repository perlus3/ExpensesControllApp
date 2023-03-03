import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersEntity } from '../../entities/users.entity';
import { hashMethod } from '../../helpers/password';
import * as JWT from 'jsonwebtoken';
import {
  AuthLoginByJWT,
  AuthPayloadJWT,
} from '../../helpers/auth/auth.interface';
import { config } from '../../configs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokensEntity } from '../../entities/refresh-tokens.entity';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

enum AuthTokenType {
  Access = 'ACCESS',
  Refresh = 'REFRESH',
}

@Injectable()
export class AuthService {
  private readonly _secretKey = this.getSecretKeyFromEnv();
  get secretKey(): string {
    return this._secretKey;
  }
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    @InjectRepository(RefreshTokensEntity)
    private refreshTokens: Repository<RefreshTokensEntity>,
    private jwtService: JwtService,
  ) {}
  getCookiesForLogOut() {
    return [
      'AccessToken=; HttpOnly; Path=/; Max-Age=0',
      'RefreshToken=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
  async removeRefreshTokenFromDb(userId: string) {
    const tokenInDb = await this.getRefreshTokenFromDb(userId);
    await this.refreshTokens.remove(tokenInDb);
  }

  async validateSessionToken(
    payload: AuthPayloadJWT,
  ): Promise<UsersEntity | null> {
    const { id } = payload.user;
    const user = await this.users.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }
    return user.getUser();
  }
  createAccessAndRefreshTokens(user: UsersEntity): AuthLoginByJWT {
    const payload = this.getTokenPayload(user);
    const accessToken = this.signToken(user.id, payload, AuthTokenType.Access);
    const refreshToken = this.signToken(
      user.id,
      {
        user: {
          id: user.id,
        },
      },
      AuthTokenType.Refresh,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  private getTokenPayload(user: UsersEntity): AuthPayloadJWT {
    return {
      user: {
        id: user.id,
        login: user.login,
        name: user.firstName + ' ' + user.lastName,
      },
    };
  }
  signToken(
    subjectId: string,
    payload: object,
    tokenType: AuthTokenType,
  ): string {
    const expiresIn = this.getTokenExpiresIn(tokenType);
    const secretKey = this.secretKey;

    return JWT.sign(payload, secretKey, {
      subject: subjectId,
      expiresIn,
    });
  }
  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decodedToken = this.jwtService.verify(refreshToken);

      const dbToken = await this.getRefreshTokenFromDb(decodedToken.sub);

      if (
        !dbToken.user ||
        !dbToken.user.isActive ||
        dbToken.user.id !== decodedToken.sub
      ) {
        return undefined;
      }

      const { accessToken } = await this.createAccessAndRefreshTokens(
        dbToken.user,
      );
      return accessToken;
    } catch (e) {
      throw new BadRequestException('Coś poszło nie tak, zaloguj się ponownie');
    }
  }
  async saveRefreshTokenIntoDb(userId: string, refreshToken: string) {
    const decode = this.jwtService.verify(refreshToken);
    const safeToken = await hashMethod(refreshToken);

    const expiresIn = dayjs(decode.exp * 1000).toDate();

    await this.refreshTokens.save({
      user: { id: userId },
      refreshToken: safeToken,
      expiresIn,
    });
  }
  getRefreshTokenFromDb(userId: string) {
    return this.refreshTokens.findOne({
      where: {
        user: {
          id: userId,
        },
        isActive: true,
      },
      relations: ['user'],
    });
  }
  async checkTokenExpTime(userId: string) {
    const token = await this.getRefreshTokenFromDb(userId);

    const today = dayjs().toDate();

    if (!token || token.expiresIn < today) {
      console.log('token deleted');
      await this.refreshTokens.remove(token);
    }
  }
  private getTokenExpiresIn(tokenType: AuthTokenType): string {
    const prefix = 'JWT_EXPIRES_';
    const value = (config as any)[prefix + tokenType];

    return (value || '').trim();
  }
  private getSecretKeyFromEnv(): string {
    const secretEnv = config.JWT_SECRET;
    const value = (secretEnv || '').trim();

    if (!value) {
      throw new Error('Secret (KEY) is empty');
    }
    return value;
  }
}
