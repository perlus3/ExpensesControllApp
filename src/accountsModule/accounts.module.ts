import { Module } from '@nestjs/common';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsService } from './accounts/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from '../entities/accounts.entity';
import { CashFlowEntity } from '../entities/cash-flow.entity';
import { CashFlowService } from './cashFlow/cashFlow.service';
import { CashFlowController } from './cashFlow/cashFlow.controller';
import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users/users.service';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { CategoriesEntity } from '../entities/categories.entity';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { UserVerificationEntity } from '../entities/user-verification.entity';

@Module({
  exports: [AccountsService, CashFlowService],
  imports: [
    TypeOrmModule.forFeature([
      AccountsEntity,
      CashFlowEntity,
      UsersEntity,
      RefreshTokensEntity,
      CategoriesEntity,
      UserVerificationEntity,
    ]),
  ],
  controllers: [AccountsController, CashFlowController, CategoriesController],
  providers: [
    AccountsService,
    CashFlowService,
    UsersService,
    CategoriesService,
  ],
})
export class AccountsModule {}
