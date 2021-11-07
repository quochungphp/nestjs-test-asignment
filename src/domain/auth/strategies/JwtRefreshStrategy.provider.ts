import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { UserResponseDto } from '../../users/UserGet/UserResponseDto';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { AuthRefreshTokenResponseDto } from '../AuthRefreshToken/AuthRefreshTokenResponseDto';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { tokenCacheKey } from '../../../pkgs/cacheKeys';
import { RedisCacheService } from '../../../pkgs/RedisCacheService/RedisCacheService';

type RefreshTokenPayloadDto = AuthRefreshTokenResponseDto;

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    context: RequestContext,
    payload: RefreshTokenPayloadDto,
  ): Promise<UserResponseDto> {
    const { sessionId, id } = payload;
    const cacheKey = tokenCacheKey(`${sessionId}-${id}`);
    const hasCache = await this.redisCacheService.hasItem(cacheKey);
    if (hasCache) {
      throw new UnauthorizedException(`Expired session : ${sessionId}`);
    }
    const user = await this.prismaService.users.findUnique({
      where: {
        id: BigInt(id),
      },
      select: {
        id: true,
        username: true,
        name: true,
        roleType: true,
      },
    });

    if (user) {
      return user;
    }

    throw new UnauthorizedException('Refresh token is not valid');
  }
}
