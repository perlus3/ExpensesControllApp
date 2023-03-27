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
    await this.cashFlowService.updateOperation(operationId, body);

    const operation = await this.cashFlowService.getOneOperation(operationId);

    const account = await this.accountService.findOneAccountById(
      operation.byUserAccount.id,
      req.user.id,
    );

    const totalValue = await this.cashFlowService.getCashFlowReport(
      req.user.id,
    );

    const { finalReport } = totalValue;

    await this.accountService.updateAccount(account.id, {
      value: finalReport,
      name: account.name,
      currency: account.currency,
    });

    return body;
  }

  @Delete('/:id')
  async deleteOperation(@Param('id') id: string, @Req() req: RequestWithUser) {
    const operation = await this.cashFlowService.getOneOperation(id);

    const account = await this.accountService.findOneAccountById(
      operation.byUserAccount.id,
      req.user.id,
    );

    const value = await this.accountService.getAccountValue(
      account.id,
      req.user.id,
    );

    if (operation.operationType === 'EXPENSE') {
      await this.accountService.updateAccount(account.id, {
        value: value + operation.value,
        name: account.name,
        currency: account.currency,
      });
    }

    if (operation.operationType === 'INCOME') {
      await this.accountService.updateAccount(account.id, {
        value: value - operation.value,
        name: account.name,
        currency: account.currency,
      });
    }

    const result = await this.cashFlowService.deleteOperation(id);

    if (result.affected === 0) {
      throw new NotFoundException('Operation not found!');
    }

    return {
      affected: result.affected,
    };
  }
  @Get('/all/:id')
  async getSingleAccountOperations(
    @Req() req: RequestWithUser,
    @Param('id') accountId: string,
  ) {
    return this.cashFlowService.getAllAccountOperations(accountId);
  }

  @Get('report')
  async getCashFlowReport(@Req() req: RequestWithUser) {
    return this.cashFlowService.getCashFlowReport(req.user.id);
  }
}
