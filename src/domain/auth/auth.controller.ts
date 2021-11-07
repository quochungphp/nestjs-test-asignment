/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthVerifyTokenAction } from './AuthVerifyToken/AuthVerifyTokenAction.service';
import { LocalAuthGuard } from './guards/LocalAuthGuard.provider';
import { IllegalStateException } from '../../pkgs/exceptions/IllegalStateException';
import JwtRefreshGuard from './guards/JwtRefreshGuard.provider';
import { AuthRefreshTokenAction } from './AuthRefreshToken/AuthRefreshTokenAction.service';
import { AppRequest } from '../../pkgs/AppRequest';
import { AuthSigninAction } from './AuthSignin/AuthSigninAction.service';
import { AuthVerifyTokenPayloadDto } from './AuthVerifyToken/AuthVerifyTokenPayloadDto';
import { AuthRefreshTokenPayloadDto } from './AuthRefreshToken/AuthRefreshTokenPayloadDto';
import { AuthBlackListTokenAction } from './AuthBlackListToken/AuthBlackListTokenAction.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard.provider';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authSigninAction: AuthSigninAction,
    private authVerifyTokenAction: AuthVerifyTokenAction,
    private authRefreshTokenAction: AuthRefreshTokenAction,
    private authBlackListTokenAction: AuthBlackListTokenAction,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('')
  async signin(@Req() request: AppRequest) {
    const { user, accessToken, refreshToken } = await this.authSigninAction.execute(request);
    const { correlationId } = request;
    if (!user || !accessToken || !refreshToken) {
      throw new IllegalStateException(correlationId);
    }

    request.res?.setHeader('accessToken', accessToken);
    request.res?.setHeader('refreshToken', refreshToken);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyToken(@Req() request: AppRequest, @Body() dto: AuthVerifyTokenPayloadDto) {
    return this.authVerifyTokenAction.execute(request, dto);
  }

  @ApiBody({ type: AuthRefreshTokenPayloadDto })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: AppRequest) {
    const { correlationId } = request;
    const { user, accessToken, refreshToken } = await this.authRefreshTokenAction.execute(request);
    if (!user || !accessToken || !refreshToken) {
      throw new IllegalStateException(correlationId);
    }
    request.res?.setHeader('accessToken', accessToken);
    request.res?.setHeader('refreshToken', refreshToken);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  @HttpCode(HttpStatus.OK)
  async blackList(@Req() request: AppRequest) {
    return this.authBlackListTokenAction.execute(request);
  }
}
