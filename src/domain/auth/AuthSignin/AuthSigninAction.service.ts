import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { NotFoundException } from '../../../pkgs/exceptions/NotFoundException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthRefreshTokenResponseDto } from '../AuthRefreshToken/AuthRefreshTokenResponseDto';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';
import { AuthSigninResponseDto } from './AuthSigninResponseDto';

@Injectable()
export class AuthSigninAction {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async execute(context: RequestContext): Promise<AuthSigninResponseDto> {
    const { correlationId, user } = context;
    if (!user) {
      throw new NotFoundException('User', 'Username and password are not correct');
    }
    const { jwtSecret, accessTokenExpiry } = this.configService;
    const payloadAccessToken: AuthAccessTokenResponseDto = {
      id: user.id,
      name: user.name,
      roleType: user.roleType,
      sessionId: correlationId,
    };

    const accessToken = this.jwtService.sign(payloadAccessToken, {
      secret: jwtSecret,
      expiresIn: accessTokenExpiry,
    });

    const payloadRefreshToken: AuthRefreshTokenResponseDto = {
      id: payloadAccessToken.id,
      sessionId: correlationId,
    };

    const refreshToken = this.jwtService.sign(payloadRefreshToken, {
      secret: jwtSecret,
      expiresIn: accessTokenExpiry,
    });

    const token: AuthSigninResponseDto = {
      user: payloadAccessToken,
      accessToken,
      refreshToken,
    };
    return token;
  }
}
