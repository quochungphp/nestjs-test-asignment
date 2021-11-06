import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userGetAction: UserGetAction, private userCreateAction: UserCreateAction) {}

  @ApiParam({ name: 'id', required: true, type: Number, example: 'Enter user id' })
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
}
