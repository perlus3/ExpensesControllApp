import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';
import { NewOperationDto, UpdateOperationDto } from '../dtos/newOperationDto';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import { AccountsService } from '../accounts/accounts.service';

@Controller('operations')
export class CashFlowController {
  constructor(
    private cashFlowService: CashFlowService,
    private accountService: AccountsService,
  ) {}
  @Post('/:id/add')
  async newOperation(
    @Param('id') accountId: string,
    @Body() expenseData: NewOperationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.cashFlowService.createOperation(
      expenseData,
      req.user.id,
      accountId,
    );
  }

  @Put('/:id')
  async updateOperation(
    @Param('id') operationId: string,
    @Body() body: UpdateOperationDto,
    @Req() req: RequestWithUser,
  ): Promise<UpdateOperationDto> {
    const operationAccount = await this.cashFlowService.findOperationAccount(
      operationId,
    );

    const account = await this.accountService.findOneAccountById(
      operationAccount.byUserAccount.id,
      req.user.id,
    );
    const value = await this.accountService.getAccountValue(
      account.id,
      req.user.id,
    );

    await this.accountService.updateAccount(account.id, {
      value,
      name: account.name,
      currency: account.currency,
    });

    await this.cashFlowService.updateOperation(operationId, body);

    return body;
  }

  @Delete('/:id')
  async deleteOperation(@Param('id') id: string) {
    const result = await this.cashFlowService.deleteOperation(id);

    if (result.affected === 0) {
      throw new NotFoundException('Operation not found!');
    }

    return {
      affected: result.affected,
    };
  }
  @Get('all')
  async getCashFlowReport(@Req() req: RequestWithUser) {
    const userOperations = await this.cashFlowService.getAllOperations(
      req.user.id,
    );
    const totalUserIncome = userOperations
      .filter((el) => el.operationType === 'INCOME')
      .reduce((sum, el) => sum + el.value, 0);

    const totalUserExpenses = userOperations
      .filter((el) => el.operationType === 'EXPENSE')
      .reduce((sum, el) => sum + el.value, 0);

    return {
      totalUserIncome,
      totalUserExpenses,
    };
  }
}
