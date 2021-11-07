import { JwtService } from '@nestjs/jwt';
import Logger from 'bunyan';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthSigninAction } from '../AuthSignin/AuthSigninAction.service';
import { AuthRefreshTokenAction } from './AuthRefreshTokenAction.service';

describe('AuthRefreshTokenAction', () => {
  let context: any;
  let authSigninAction: AuthSigninAction;
  let authRefreshTokenAction: AuthRefreshTokenAction;

  beforeEach(async () => {
    context = {
      user: {
        id: '1',
        name: 'Administrator',
        roleType: 'ADMIN',
      },
      correlationId: '80939640-6140-463a-90e4-4cdc0e89deb9',
      logger: {} as Logger,
    };
    authSigninAction = new AuthSigninAction(
      new JwtService({ privateKey: 'INTF55QGsvzKIfsiCQDS4_7iCz' }),
      new ConfigService(),
    );
    authRefreshTokenAction = new AuthRefreshTokenAction(authSigninAction);
  });

  it('should return user info and tokens when AuthRefreshTokenAction was be called execute function', async () => {
    const response = await authRefreshTokenAction.execute(context as RequestContext);
    expect(response).toMatchObject({
      user: {
        id: '1',
        name: 'Administrator',
        roleType: 'ADMIN',
        sessionId: '80939640-6140-463a-90e4-4cdc0e89deb9',
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
