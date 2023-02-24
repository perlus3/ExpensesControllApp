import { Module } from '@nestjs/common';
import {TypeormImports} from "./typeorm";
import {UsersController} from "./controllers/users/users.controller";
import {UsersService} from "./services/users/users.service";
@Module({
  imports: [...TypeormImports],
  controllers: [UsersController,],
  providers: [UsersService],
})
export class AppModule {}
