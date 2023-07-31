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
import { config } from '../configs/config';

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

  async validateToken(token: string) {
    const tokenInDb = await this.userVerification.findOne({
      where: {
        id: token,
      },
    });
    if (!tokenInDb) {
      throw new BadRequestException('Błąd autoryzacji');
    }
  }

  async sendSetNewPasswordEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Taki użytkownik nie istnieje!');
    }
    const tokenInDb = await this.usersService.findVerificationTokenByUserId(
      user.id,
    );

    const subject = 'Reset hasła ExpenseApp';
    const url = `${config.APP_DOMAIN}/reset-password/${user.id}/${tokenInDb.id}`;
    await this.emailService.sendMail(
      email,
      subject,
      MailTemplate.ResetPassword,
      {
        email,
        confirmUrl: url,
      },
    );
  }

  async sendVerificationLink(email: string, id: string) {
    const token: string = randomUUID();
    const tokenInDb = await this.usersService.findVerificationTokenByUserId(id);
    const today = dayjs().toDate();

    if (!tokenInDb || tokenInDb?.expiresAt < today) {
      const expTime = dayjs().add(2, 'h').toDate();
      const user = await this.users.findOne({
        where: {
          id,
        },
      });

      await this.userVerification.save({
        id: token,
        user,
        expiresAt: expTime,
      });

      const url = `${config.APP_DOMAIN}/email/confirm-email/${token}`;
      const subject = 'User Email confirmation';

      return this.emailService.sendMail(
        email,
        subject,
        MailTemplate.EmailConfirmation,
        {
          email,
          confirmUrl: url,
        },
      );
    }
  }
  async checkToken(tokenId: string) {
    const token = await this.userVerification.findOne({
      where: {
        id: tokenId,
      },
      relations: ['user'],
    });

    if (!token) {
      throw new BadRequestException('Bad token');
    }
    const today = dayjs().toDate();
    const { user } = token;

    if (token.expiresAt < today) {
      await this.usersService.deleteUserAccount(user.id);
      throw new BadRequestException(
        'Link aktywacyjny wygasł zarejestruj się ponownie!',
      );
    }

    if (token?.verified) {
      throw new BadRequestException('Konto zostało już potwierdzone!');
    }
    await this.usersService.markUserAsVerified(token.id);
  }
}
