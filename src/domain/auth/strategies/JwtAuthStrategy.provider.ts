import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';

type AccessTokenPayloadDto = AuthAccessTokenResponseDto;
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<AuthAccessTokenResponseDto> {
    return payload;
  }
}
