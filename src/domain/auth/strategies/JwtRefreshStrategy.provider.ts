import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { UserResponseDto } from '../../users/UserGet/UserResponseDto';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { AuthRefreshTokenResponseDto } from '../AuthRefreshToken/AuthRefreshTokenResponseDto';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';

type RefreshTokenPayloadDto = AuthRefreshTokenResponseDto;

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
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
    const { id } = payload;
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
