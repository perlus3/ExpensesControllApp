import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities/users.entity';
import { RegisterUserDto } from '../../dtos/registerUser.dto';
import { compareMethod, hashMethod } from '../../helpers/password';
import { RefreshTokensEntity } from '../../entities/refresh-tokens.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    @InjectRepository(RefreshTokensEntity)
    private refreshTokens: Repository<RefreshTokensEntity>,
  ) {}
  async register(dto: RegisterUserDto): Promise<UsersEntity> {
    try {
      const user = new UsersEntity();

      user.login = dto.login;
      user.email = dto.email;
      user.firstName = dto.firstName || '';
      user.lastName = dto.lastName || '';
      user.password = await hashMethod(dto.password || '');

      return await this.users.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User with that email or login already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserById(userId: string): Promise<any> {
    const userAccounts = await this.users
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .where('user.id = :id', { id: userId })
      .getMany();

    const { accounts } = userAccounts[0];
    const ids = accounts.map((el) => el.id);

    const user = await this.users.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      return {
        user,
        userAccounts: ids,
      };
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAuthenticatedUserFromDb(
    login: string,
    password: string,
  ): Promise<UsersEntity | undefined> {
    const user = await this.users.findOne({
      select: ['id', 'login', 'firstName', 'lastName', 'password', 'isActive'],
      where: {
        login,
      },
    });

    if (!user?.isActive || !user?.password) {
      return undefined;
    }
    if (await compareMethod(password, user.password)) {
      return user.getUser();
    }
    return undefined;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<UsersEntity> {
    try {
      const user = await this.getUserById(userId);
      const token = await this.refreshTokens.findOne({
        where: {
          user: {
            id: userId,
          },
          isActive: true,
        },
        relations: ['user'],
      });

      if (refreshToken === token.refreshToken) {
        return user;
      }
    } catch (e) {
      throw new BadRequestException('Błąd serwera, zaloguj się ponownie!');
    }
  }
}
