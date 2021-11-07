import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { roleType } from '@prisma/client';
import { UserCreateAction } from './UserCreate/UserCreateAction.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.provider';
import { AppRequest } from '../../pkgs/AppRequest';
import { Roles } from '../../pkgs/decorators/Roles';
import { ParseBigIntPipe } from '../../pkgs/ParseBigIntPipe';
import { RolesGuard } from '../auth/guards/RolesGuard.provider';
import { UserCreatePayloadDto } from './UserCreate/UserCreatePayloadDto';
import { UserGetAction } from './UserGet/UserGetAction.service';
import { AuthVerifyApiKey } from '../auth/AuthVerifyApiKey/AuthVerifyApiKey';
import { UserGetListAction } from './UserGetList/UserGetListAction.service';
import { UserUpdateAction } from './UserUpdate/UserUpdateAction.service';
import { UserDeleteAction } from './UserDelete/UserDeleteAction.service';
import { UserUpdatePayloadDto } from './UserUpdate/UserUpdatePayloadDto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private userGetAction: UserGetAction,
    private userCreateAction: UserCreateAction,
    private userGetListAction: UserGetListAction,
    private userUpdateAction: UserUpdateAction,
    private userDeleteAction: UserDeleteAction,
  ) {}

  @ApiParam({ name: 'id', required: true, type: Number, example: 'Enter user id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleType.USER)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async details(@Req() request: AppRequest, @Param('id', ParseBigIntPipe) id: bigint) {
    return this.userGetAction.execute(request, id);
  }

  @ApiParam({ name: 'name', required: true, type: String, example: 'Enter name' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('')
  async update(@Req() request: AppRequest, @Body() dto: UserUpdatePayloadDto) {
    return this.userUpdateAction.execute(request, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Req() request: AppRequest, @Param('id', ParseBigIntPipe) id: bigint) {
    return this.userDeleteAction.execute(request, id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthVerifyApiKey)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Req() request: AppRequest, @Body() dto: UserCreatePayloadDto) {
    return this.userCreateAction.execute(request, dto);
  }

  @ApiParam({ name: 'id', required: true, type: Number, example: 'Enter user id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getUsers(
    @Req() request: AppRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('name') name: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userGetListAction.execute(request, name, page, limit);
  }
}
