import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { UserCreateAction } from './UserCreate/UserCreateAction.service';
import { UserGetAction } from './UserGet/UserGetAction.service';
import { UserController } from './users.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [UserController],
  providers: [UserGetAction, UserCreateAction],
})
export class UserModule {}
