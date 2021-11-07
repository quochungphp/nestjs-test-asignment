/* eslint-disable unicorn/consistent-destructuring */
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthSigninAction } from '../AuthSignin/AuthSigninAction.service';
import { AuthSigninResponseDto } from '../AuthSignin/AuthSigninResponseDto';

@Injectable()
export class AuthRefreshTokenAction {
  constructor(private authSigninAction: AuthSigninAction) {}

  async execute(context: RequestContext): Promise<AuthSigninResponseDto> {
    try {
      return await this.authSigninAction.execute(context);
    } catch {
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }
}
