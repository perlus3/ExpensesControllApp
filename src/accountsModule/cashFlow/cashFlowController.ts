import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';
import { NewOperationDto } from '../dtos/newOperationDto';
import { RequestWithUser } from '../../helpers/auth/auth.interface';

@Controller('operations')
export class CashFlowController {
  constructor(private cashFlowService: CashFlowService) {}
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
  @Get('all')
  async getCashFlowReport(@Req() req: RequestWithUser) {
    const userOperations = await this.cashFlowService.getAllOperations(
      req.user.id,
    );
    const totalUserIncome = userOperations
      .filter((el) => el.operationType === 'INCOME')
      .reduce((sum, el) => sum + el.amount, 0);

    const totalUserExpenses = userOperations
      .filter((el) => el.operationType === 'EXPENSE')
      .reduce((sum, el) => sum + el.amount, 0);

    return {
      totalUserIncome,
      totalUserExpenses,
    };
  }
}
