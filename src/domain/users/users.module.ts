import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { UserCreateAction } from './UserCreate/UserCreateAction.service';
import { UserDeleteAction } from './UserDelete/UserDeleteAction.service';
import { UserGetAction } from './UserGet/UserGetAction.service';
import { UserGetListAction } from './UserGetList/UserGetListAction.service';
import { UserController } from './users.controller';
import { UserUpdateAction } from './UserUpdate/UserUpdateAction.service';

@Module({
  imports: [InfrastructureModule],
  controllers: [UserController],
  providers: [
    UserGetAction,
    UserCreateAction,
    UserGetListAction,
    UserUpdateAction,
    UserDeleteAction,
  ],
})
export class UserModule {}
