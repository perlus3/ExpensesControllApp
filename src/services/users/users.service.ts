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
import { RefreshTokensEntity } from '../../entities/refresh-tokens.entity';
import { UserVerificationEntity } from '../../entities/user-verification.entity';
import { compareMethod, hashMethod } from 'src/helpers/password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    @InjectRepository(UserVerificationEntity)
    private userVerification: Repository<UserVerificationEntity>,
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
      if (error.statusCode === 500) {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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

    const isVerified = await this.userVerification
      .createQueryBuilder('user_verification_entity')
      .leftJoinAndSelect('user_verification_entity.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!user?.isActive || !user?.password) {
      return undefined;
    }

    if (!isVerified.verified) {
      throw new BadRequestException(
        'Aby się zalogować musisz najpierw potwierdzić rejestracje na podanym adresie email!',
      );
    }

    if (await compareMethod(password, user.password)) {
      return user.getUser();
    }
    return undefined;
  }

  async markUserAsVerified(id: string) {
    return this.userVerification.update(
      { id },
      {
        verified: true,
      },
    );
  }

  async findOneByEmail(email: string) {
    return await this.users.findOne({
      where: {
        email,
      },
    });
  }

  async findVerificationTokenByUserId(userId: string) {
    return await this.userVerification.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async findVerificationTokenById(row: Partial<UserVerificationEntity>) {
    return await this.userVerification.findOne({
      where: {
        id: row.id,
      },
    });
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
      });
      if (refreshToken === token.refreshToken) {
        return user;
      }
    } catch (e) {
      throw new BadRequestException('Błąd serwera, zaloguj się ponownie!');
    }
  }
}
