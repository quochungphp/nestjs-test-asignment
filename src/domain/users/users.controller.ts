import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private userGetAction: UserGetAction,
    private userCreateAction: UserCreateAction,
    private userGetListAction: UserGetListAction,
  ) {}

  @ApiParam({ name: 'id', required: true, type: Number, example: 'Enter user id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleType.USER)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async details(@Req() request: AppRequest, @Param('id', ParseBigIntPipe) id: bigint) {
    return this.userGetAction.execute(request, id);
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
