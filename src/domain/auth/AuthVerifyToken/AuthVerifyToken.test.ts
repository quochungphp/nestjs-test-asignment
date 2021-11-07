import { JwtService } from '@nestjs/jwt';
import Logger from 'bunyan';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { AuthSigninAction } from '../AuthSignin/AuthSigninAction.service';
import { AuthVerifyTokenAction } from './AuthVerifyTokenAction.service';

describe('AuthVerifyTokenAction', () => {
  let context: any;
  let authSigninAction: AuthSigninAction;
  let authVerifyTokenAction: AuthVerifyTokenAction;
  const { jwtSecret } = new ConfigService();
  beforeEach(async () => {
    context = {
      user: {
        id: '1',
        name: 'Administrator',
        roleType: 'ADMIN',
        sessionId: '80939640-6140-463a-90e4-4cdc0e89deb9',
      },
      correlationId: '80939640-6140-463a-90e4-4cdc0e89deb9',
      logger: {} as Logger,
    };
    authSigninAction = new AuthSigninAction(new JwtService({ privateKey: jwtSecret }));
    authVerifyTokenAction = new AuthVerifyTokenAction(
      new JwtService({
        privateKey: jwtSecret,
        publicKey: jwtSecret,
      }),
    );
  });

  it('should return user info when AuthVerifyTokenAction was be called execute function', async () => {
    const response = await authSigninAction.execute(context as RequestContext);
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

    const responseVerifyToken = await authVerifyTokenAction.execute(context as RequestContext, {
      token: response.accessToken,
    });

    expect(responseVerifyToken).toMatchObject({
      id: '1',
      name: 'Administrator',
      roleType: 'ADMIN',
      sessionId: '80939640-6140-463a-90e4-4cdc0e89deb9',
      iat: expect.any(Number),
    });
  });
});
