import { BadRequestException, Injectable } from '@nestjs/common';
import { MailsService, MailTemplate } from '../mails/mails.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { UserVerificationEntity } from '../entities/user-verification.entity';
import { UsersEntity } from '../entities/users.entity';
import { AuthService } from '../services/auth/auth.service';
import { UsersService } from '../services/users/users.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @InjectRepository(UserVerificationEntity)
    private userVerification: Repository<UserVerificationEntity>,
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    private readonly emailService: MailsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async sendVerificationLink(email: string, id: string) {
    const token: string = randomUUID();
    const tokenInDb = await this.usersService.findVerificationTokenByUserId(id);

    const today = dayjs().toDate();

    if (!tokenInDb || tokenInDb.expiresAt < today) {
      if (tokenInDb?.verified) {
        throw new BadRequestException('User is already confirmed');
      }
      const user = await this.usersService.findOneByEmail(email);

      if (user) {
        const { id } = user;
        const expTime = dayjs().add(2, 'h').toDate();

        await this.userVerification.save({
          id: token,
          user: id,
          expiresAt: expTime,
        });
      }
      const url = `localhost:3001/email/confirm-email/${token}`;
      const subject = 'User Email confirmation';

      return this.emailService.sendMail(
        email,
        subject,
        MailTemplate.EmailConfirmation,
        {
          userName: user.firstName,
          userLastName: user.lastName,
          confirmUrl: url,
        },
      );
    }
  }

  async checkToken(id: string) {
    const token = await this.userVerification.findOne({
      where: {
        id,
      },
    });

    if (!token) {
      throw new BadRequestException('Bad token');
    }

    return token;
  }

  async verifyUser(row: Partial<UserVerificationEntity>) {
    const token = await this.usersService.findVerificationTokenById(row);

    const today = dayjs().toDate();

    if (!token || token.expiresAt < today) {
      throw new BadRequestException('Link aktywacyjny wygasł!');
    }

    if (token?.verified) {
      throw new BadRequestException('User is already confirmed');
    }
    await this.usersService.markUserAsVerified(token.id);

    return token;
  }
}
