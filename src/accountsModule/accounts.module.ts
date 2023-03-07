import { Module } from '@nestjs/common';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsService } from './accounts/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from '../entities/accounts.entity';
import { CashFlowEntity } from '../entities/cash-flow.entity';
import { CashFlowService } from './cashFlow/cash-flow.service';
import { CashFlowController } from './cashFlow/cashFlowController';
import { UsersEntity } from '../entities/users.entity';

//@Todo czy tu w importach powinny byc entity skoro sa w appmodule?
@Module({
  exports: [AccountsService, CashFlowService],
  imports: [
    TypeOrmModule.forFeature([AccountsEntity, CashFlowEntity, UsersEntity]),
  ],
  controllers: [AccountsController, CashFlowController],
  providers: [AccountsService, CashFlowService],
})
export class AccountsModule {}
