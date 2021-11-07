import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '../../../pkgs/exceptions/NotFoundException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthRefreshTokenResponseDto } from '../AuthRefreshToken/AuthRefreshTokenResponseDto';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';
import { AuthSigninResponseDto } from './AuthSigninResponseDto';

@Injectable()
export class AuthSigninAction {
  constructor(private jwtService: JwtService) {}

  async execute(context: RequestContext): Promise<AuthSigninResponseDto> {
    const { correlationId, user } = context;
    if (!user) {
      throw new NotFoundException('User', 'Username and password are not correct');
    }

    const payloadAccessToken: AuthAccessTokenResponseDto = {
      id: user.id,
      name: user.name,
      roleType: user.roleType,
      sessionId: correlationId,
    };

    const accessToken = this.jwtService.sign({ ...payloadAccessToken, token: user.token });

    const payloadRefreshToken: AuthRefreshTokenResponseDto = {
      id: payloadAccessToken.id,
      sessionId: correlationId,
    };
    const refreshToken = this.jwtService.sign(payloadRefreshToken);

    const token: AuthSigninResponseDto = {
      user: payloadAccessToken,
      accessToken,
      refreshToken,
    };
    return token;
  }
}
