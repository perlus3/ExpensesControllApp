import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UsersEntity} from "../../entities/users.entity";
import {RegisterUserDto} from "../../dtos/registerUser.dto";
import {hashPassword} from "../../helpers/password";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    ) {
    }

    async register(dto: RegisterUserDto) {
        const user = new UsersEntity();

        user.login = dto.login;
        user.email = dto.email;
        user.firstName = dto.firstName || '';
        user.lastName = dto.lastName || '';
        user.password = await hashPassword(dto.password || '');

        return this.users.insert(user);
    }
}
