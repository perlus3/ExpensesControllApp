import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsEntity } from '../../entities/accounts.entity';
import { CreateNewAccountDto } from '../dtos/createNewAccount.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsEntity)
    private accountsEntity: Repository<AccountsEntity>,
  ) {}

  async createNewAccount(
    accountData: CreateNewAccountDto,
    userId: string,
  ): Promise<AccountsEntity> {
    const newAccount = this.accountsEntity.create(accountData);

    return this.accountsEntity.save({
      ...newAccount,
      user: {
        id: userId,
      },
    });
  }

  async findOneAccountById(
    id: AccountsEntity['id'],
    userId: string,
  ): Promise<AccountsEntity> {
    const account = await this.accountsEntity.findOne({
      where: { id },
      relations: ['user'],
    });
    if (account.user.id !== userId) {
      throw new BadRequestException('TO NIE TWOJE KONTO GAGATKU');
    }

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return account;
  }

  async findAllByUserId(userId: string): Promise<AccountsEntity[]> {
    return this.accountsEntity.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }
  async getAccountValue(id: string, userId: string): Promise<number> {
    const account = await this.findOneAccountById(id, userId);

    return account.value;
  }

  async getTotalAccountsValue(userId: string): Promise<number> {
    const accounts = await this.findAllByUserId(userId);
    const values = accounts.map((el) => el.value);
    return values.reduce((sum, value) => sum + value, 0);
  }
}
