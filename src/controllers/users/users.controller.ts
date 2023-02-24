import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import {UsersEntity} from "../../entities/users.entity";
import {RegisterUserDto} from "../../dtos/registerUser.dto";
import {UsersService} from "../../services/users/users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,) {}

    // @Get('me')
    // async getMyProfile(@Req() req: Request): Promise<UsersEntity> {
    //     console.log(req)
    //     return req.user as UsersEntity;
    // }

    @Post('/register')
    async register(@Body() registerData: RegisterUserDto) {
        const user = await this.usersService.register(registerData);
        return user;
    }
}
