import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AccountsEntity } from '../../entities/accounts.entity';
import {
  CreateNewAccountDto,
  UpdateAccountDto,
} from '../dtos/createNewAccount.dto';
import { CashFlowEntity } from '../../entities/cash-flow.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsEntity)
    private accountsEntity: Repository<AccountsEntity>,
    @InjectRepository(CashFlowEntity)
    private cashFlowEntity: Repository<CashFlowEntity>,
  ) {}

  async createNewAccount(
    accountData: CreateNewAccountDto,
    userId: string,
  ): Promise<AccountsEntity> {
    const newAccount = await this.accountsEntity.create(accountData);

    return this.accountsEntity.save({
      ...newAccount,
      user: {
        id: userId,
      },
      relations: ['user'],
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

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    if (account.user.id !== userId) {
      throw new BadRequestException('TO NIE TWOJE KONTO GAGATKU');
    }

    return account;
  }

  async findAllByUserId(userId: string): Promise<AccountsEntity[]> {
    return this.accountsEntity
      .createQueryBuilder('accounts')
      .leftJoinAndSelect('accounts.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  }
  async getAllOperations(userId: string): Promise<CashFlowEntity[]> {
    return await this.cashFlowEntity.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }
  async getAccountValue(accountId: string, userId: string): Promise<number> {
    const values = await this.getAllOperations(userId);
    const totalValue = values.map((el) => {
      if (el.operationType === 'EXPENSE') {
        el.value = -el.value;
      }
      return el.value;
    });
    return totalValue.reduce((sum, value) => sum + Number(value), 0);
  }

  async getTotalAccountsValue(userId: string): Promise<number> {
    const accounts = await this.findAllByUserId(userId);
    const values = accounts.map((el) => el.value);
    return values.reduce((sum, value) => sum + Number(value), 0);
  }
  async updateAccount(
    accountId: string,
    body: UpdateAccountDto,
  ): Promise<UpdateResult> {
    return this.accountsEntity.update(accountId, body);
  }

  async deleteAccount(id: string) {
    return await this.accountsEntity.delete(id);
  }
}
