import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';

type UserAccessToken = AuthAccessTokenResponseDto;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends UserAccessToken>(
    error: Error,
    user: TUser,
    info: TokenExpiredError,
    context: ExecutionContext,
  ) {
    if (error || !user) {
      throw error || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
