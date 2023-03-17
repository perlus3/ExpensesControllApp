import { Controller, Get, Param, Req } from '@nestjs/common';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import { AccountsService } from '../../accountsModule/accounts/accounts.service';
import { UsersService } from '../../services/users/users.service';

@Controller('user')
export class UserController {
  constructor(
    private accountService: AccountsService,
    private usersService: UsersService,
  ) {}

  @Get()
  async getMyProfile(@Req() req: RequestWithUser) {
    return this.usersService.getUserById(req.user.id);
  }
  @Get('/:id')
  getUserAccounts(@Param('id') id: string) {
    return this.accountService.findAllByUserId(id);
  }
}
