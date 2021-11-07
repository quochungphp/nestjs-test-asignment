import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthValidateAction } from '../AuthValidate/AuthValidateAction.service';
import { UserResponseDto } from '../../users/UserGet/UserResponseDto';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'passport-local') {
  constructor(private readonly authValidateAction: AuthValidateAction) {
    super();
  }

  async validate(username: string, password: string): Promise<UserResponseDto> {
    return this.authValidateAction.execute(username, password);
  }
}
