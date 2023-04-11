import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CashFlowEntity } from '../../entities/cash-flow.entity';
import { NewOperationDto, UpdateOperationDto } from '../dtos/newOperationDto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../../entities/accounts.entity';
import { CategoriesEntity } from '../../entities/categories.entity';
import { FilterOperationsDto } from '../dtos/filterOperations.dto';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectRepository(CashFlowEntity)
    private cashFlowEntity: Repository<CashFlowEntity>,
    @InjectRepository(AccountsEntity)
    private accountsEntity: Repository<AccountsEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesEntity: Repository<CategoriesEntity>,
    private accountsService: AccountsService,
  ) {}

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
        account.value = Number(account.value) - Number(newOperation.value);
        break;
      case 'INCOME':
        account.value = Number(account.value) + Number(newOperation.value);
        break;
      default:
        return undefined;
    }

    await this.accountsEntity.save({
      ...account,
    });

    const { categoryId } = operationData;

    const category = await this.categoriesEntity.findOne({
      where: {
        id: categoryId,
      },
    });

    if (category.type !== newOperation.operationType) {
      throw new BadRequestException(
        'Typ kategorii różni się od typu operacji!',
      );
    }

    return this.cashFlowEntity.save({
      ...newOperation,
      user: {
        id: userId,
      },
      byUserAccount: {
        id: accountId,
      },
      category: {
        id: categoryId,
      },
    });
  }

  async updateOperation(
    operationId: string,
    body: UpdateOperationDto,
  ): Promise<UpdateResult> {
    return this.cashFlowEntity
      .createQueryBuilder()
      .update(CashFlowEntity)
      .set({
        name: body.name,
        value: body.value,
      })
      .where('id = :id', { id: operationId })
      .execute();
  }

  async deleteOperation(id: string) {
    return await this.cashFlowEntity.delete(id);
  }

  async getAllAccountOperations(accountId: string): Promise<CashFlowEntity[]> {
    return await this.cashFlowEntity.find({
      where: {
        byUserAccount: {
          id: accountId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['byUserAccount', 'category'],
    });
  }

  async getCategoryDetails(categoryId: string) {
    return await this.cashFlowEntity.find({
      where: {
        category: {
          id: categoryId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['category'],
    });
  }

  async getOperationsWithFilters(
    categoryId: string,
    filterDto: FilterOperationsDto,
  ) {
    const { startDate, endDate } = filterDto;

    const operations = await this.getCategoryDetails(categoryId);

    const filteredOperations = operations.filter((el) => {
      const createdAtDate = el.createdAt.toLocaleDateString('pl-PL');

      if (startDate && !endDate) {
        return (
          new Date(createdAtDate.split('.').reverse().join('-')) >=
          new Date(startDate.split('.').reverse().join('-'))
        );
      }
      if (!startDate && endDate) {
        return (
          new Date(createdAtDate.split('.').reverse().join('-')) <=
          new Date(endDate.split('.').reverse().join('-'))
        );
      }
      return (
        new Date(createdAtDate.split('.').reverse().join('-')) >=
          new Date(startDate.split('.').reverse().join('-')) &&
        new Date(createdAtDate.split('.').reverse().join('-')) <=
          new Date(endDate.split('.').reverse().join('-'))
      );
    });

    return filteredOperations;
  }

  async getOneOperation(operationId: string): Promise<CashFlowEntity> {
    return await this.cashFlowEntity.findOne({
      where: {
        id: operationId,
      },
      relations: ['byUserAccount', 'category'],
    });
  }

  async getAllUserOperations(userId: string): Promise<CashFlowEntity[]> {
    return await this.cashFlowEntity.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async getCashFlowReport(userId: string) {
    const userOperations = await this.getAllUserOperations(userId);
    const totalUserIncome = userOperations
      .filter((el) => el.operationType === 'INCOME')
      .reduce((sum, el) => sum + Number(el.value), 0);

    const totalUserExpenses = userOperations
      .filter((el) => el.operationType === 'EXPENSE')
      .reduce((sum, el) => sum + Number(el.value), 0);

    const finalReport = totalUserIncome - totalUserExpenses;

    return {
      userOperations,
      totalUserIncome,
      totalUserExpenses,
      finalReport,
    };
  }
}
