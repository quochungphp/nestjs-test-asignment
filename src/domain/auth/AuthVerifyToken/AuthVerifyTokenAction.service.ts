import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthRefreshTokenResponseDto } from '../AuthRefreshToken/AuthRefreshTokenResponseDto';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';
import { AuthVerifyTokenPayloadDto } from './AuthVerifyTokenPayloadDto';

@Injectable()
export class AuthVerifyTokenAction {
  constructor(private jwtService: JwtService) {}

  async execute(
    context: RequestContext,
    payload: AuthVerifyTokenPayloadDto,
  ): Promise<AuthAccessTokenResponseDto | AuthRefreshTokenResponseDto> {
    const { token } = payload;
    return this.jwtService.verify(token);
  }
}
