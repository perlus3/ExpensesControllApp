import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CashFlowEntity } from '../../entities/cash-flow.entity';
import { NewOperationDto, UpdateOperationDto } from '../dtos/newOperationDto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../../entities/accounts.entity';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectRepository(CashFlowEntity)
    private cashFlowEntity: Repository<CashFlowEntity>,
    @InjectRepository(AccountsEntity)
    private accountsEntity: Repository<AccountsEntity>,
    private accountsService: AccountsService,
  ) {}

  //@Todo OperationType dac ja jako osobny argument w funkcji czy przekazywac w Body?
  async createOperation(
    operationData: NewOperationDto,
    userId: string,
    accountId: string,
  ): Promise<CashFlowEntity> {
    const newOperation = this.cashFlowEntity.create(operationData);
    const account = await this.accountsService.findOneAccountById(
      accountId,
      userId,
    );

    switch (newOperation.operationType) {
      case 'EXPENSE':
        account.value = account.value - newOperation.value;
        break;
      case 'INCOME':
        account.value = account.value + newOperation.value;
        break;
      default:
        return undefined;
    }

    await this.accountsEntity.save({
      ...account,
    });

    return this.cashFlowEntity.save({
      ...newOperation,
      user: {
        id: userId,
      },
      byUserAccount: account,
    });
  }

  async updateOperation(
    operationId: string,
    body: UpdateOperationDto,
  ): Promise<UpdateResult> {
    return this.cashFlowEntity.update(operationId, body);
  }

  async deleteOperation(id: string) {
    return await this.cashFlowEntity.delete(id);
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

  async findOperationAccount(operationId: string): Promise<CashFlowEntity> {
    return await this.cashFlowEntity.findOne({
      where: {
        id: operationId,
      },
      relations: ['byUserAccount'],
    });
  }
}
