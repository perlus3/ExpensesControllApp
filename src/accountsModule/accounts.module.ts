import { Module } from '@nestjs/common';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsService } from './accounts/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from '../entities/accounts.entity';
import { ExpensesEntity } from '../entities/expenses.entity';
import { IncomeEntity } from '../entities/income.entity';
import { ExpensesService } from './expenses/expenses.service';
import { IncomeService } from './income/income.service';
import { ExpensesController } from './expenses/expenses.controller';
import { IncomeController } from './income/income.controller';

//@Todo czy tu w importach powinny byc entity skoro sa w appmodule?
@Module({
  exports: [AccountsService, ExpensesService, IncomeService],
  imports: [
    TypeOrmModule.forFeature([AccountsEntity, ExpensesEntity, IncomeEntity]),
  ],
  controllers: [AccountsController, ExpensesController, IncomeController],
  providers: [AccountsService, ExpensesService, IncomeService],
})
export class AccountsModule {}
