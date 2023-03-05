import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import { CreateNewAccountDto } from '../dtos/createNewAccount.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/all')
  async getAll(@Req() req: RequestWithUser) {
    return this.accountsService.findAllByUserId(req.user.id);
  }

  @Get('/total-value')
  async getTotalValue(@Req() req: RequestWithUser) {
    return this.accountsService.getTotalAccountsValue(req.user.id);
  }

  @Get('/ids')
  async getAccountsId(@Req() req: RequestWithUser) {
    const allAccounts = await this.accountsService.findAllByUserId(req.user.id);
    return allAccounts.map((el) => el.id);
  }

  @Get('/:id')
  async getSingleAccount(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.accountsService.findOneAccountById(id, userId);
  }

  @Get('/:id/value')
  async getSingleAccountValue(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.accountsService.getAccountValue(id, userId);
  }

  @Post('/add')
  async createNewAccount(
    @Body() body: CreateNewAccountDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.accountsService.createNewAccount(body, req.user.id);
  }
}
