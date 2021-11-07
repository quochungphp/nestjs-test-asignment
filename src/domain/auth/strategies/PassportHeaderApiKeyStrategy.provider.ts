/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { AppRequest } from '../../../pkgs/AppRequest';

@Injectable()
export class PassportHeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor() {
    super(
      { header: 'x-api-key', prefix: '' },
      true,
      async (apiKey: string, done: Function, request: AppRequest) => {
        return this.validate(apiKey, done, request);
      },
    );
  }

  public validate = (apiKey: string, done: Function, request: AppRequest) => {
    if (apiKey && apiKey.length > 0) {
      done(null, true);
    }
    done(new UnauthorizedException('Unauthorized'), null);
  };
}
