import { JwtService } from '@nestjs/jwt';
import Logger from 'bunyan';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthSigninAction } from './AuthSigninAction.service';

describe('AuthSigninAction', () => {
  let context: any;
  let authSigninAction: AuthSigninAction;
  beforeEach(async () => {
    context = {
      user: {
        id: '1',
        name: 'Administrator',
        roleType: 'ADMIN',
      },
      correlationId: '7b5c279a-5d1f-4529-ab80-d586e0b290ad',
      logger: {} as Logger,
    };
    authSigninAction = new AuthSigninAction(
      new JwtService({ privateKey: 'UN28zQZh4VU' }),
      new ConfigService(),
    );
  });

  it('should return user info and tokens when AuthSigninAction was be called execute function', async () => {
    const response = await authSigninAction.execute(context as RequestContext);
    expect(response).toMatchObject({
      user: {
        id: '1',
        name: 'Administrator',
        roleType: 'ADMIN',
        sessionId: '7b5c279a-5d1f-4529-ab80-d586e0b290ad',
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
