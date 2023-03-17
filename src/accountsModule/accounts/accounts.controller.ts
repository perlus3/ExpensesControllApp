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
import { AccountsService } from './accounts.service';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import {
  CreateNewAccountDto,
  UpdateAccountDto,
} from '../dtos/createNewAccount.dto';
import { AccountsEntity } from '../../entities/accounts.entity';

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
    @Param('id') accountId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.accountsService.getAccountValue(accountId, userId);
  }

  @Post('/add')
  async createNewAccount(
    @Body() body: CreateNewAccountDto,
    @Req() req: RequestWithUser,
  ) {
    return this.accountsService.createNewAccount(body, req.user.id);
  }

  @Put(':id')
  async updateAccount(
    @Param('id') accountId: string,
    @Body() body: UpdateAccountDto,
    @Req() req: RequestWithUser,
  ): Promise<AccountsEntity> {
    await this.accountsService.updateAccount(accountId, body);
    return this.accountsService.findOneAccountById(accountId, req.user.id);
  }

  @Delete('/:id')
  async deleteAccount(@Param('id') id: string) {
    const result = await this.accountsService.deleteAccount(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found!');
    }

    return {
      affected: result.affected,
    };
  }
}
