import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { tokenCacheKey } from '../../../pkgs/cacheKeys';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { RedisCacheService } from '../../../pkgs/RedisCacheService/RedisCacheService';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';

type AccessTokenPayloadDto = AuthAccessTokenResponseDto;
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(private configService: ConfigService, private redisCacheService: RedisCacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<AuthAccessTokenResponseDto> {
    const { sessionId, id } = payload;
    const cacheKey = tokenCacheKey(`${sessionId}-${id}`);
    const hasCache = await this.redisCacheService.hasItem(cacheKey);
    if (hasCache) {
      throw new UnauthorizedException(`Expired session : ${sessionId}`);
    }

    return payload;
  }
}
