import { UsersEntity } from '../../entities/users.entity';
import { Request } from 'express';
export interface AuthPayloadJWT {
  user: {
    id: UsersEntity['id'];
    login: UsersEntity['login'];
    name: string;
  };
}

export interface AuthLoginByJWT {
  accessToken: string;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: UsersEntity;
}
