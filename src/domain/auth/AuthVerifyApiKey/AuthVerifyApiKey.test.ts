import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { AuthVerifyApiKey } from './AuthVerifyApiKey';

jest.mock('@prisma/client', () => {
  const mockAuth = jest.fn().mockResolvedValue({
    id: '1',
    username: 'admin',
    password: '$2y$12$I/fj9GGj48x9vpjAM6fJo.4fXzKeR6ZH97GMGk7UgyfcyYrUqGd9S',
    name: 'Administrator',
    roleType: 'ADMIN',
  });
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        authentication_token: {
          findUnique: mockAuth,
        },
      };
    }),
  };
});

describe('AuthVerifyUser checks user distributor', () => {
  let authVerifyApiKey: AuthVerifyApiKey;
  const configService = new ConfigService();
  beforeEach(async () => {
    jest.clearAllMocks();
    authVerifyApiKey = new AuthVerifyApiKey(configService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be return true when AuthVerifyUser was be called canActive function', async () => {
    const context: ExecutionContext = {
      switchToHttp: () => context,
      getArgs: () => [
        {
          headers: {
            'x-api-key': configService.apiKey,
          },
        },
      ],
      getRequest: () => {},
      getResponse: () => {},
    } as unknown as ExecutionContext;
    const response = await authVerifyApiKey.canActivate(context);
    expect(response).toEqual(true);
  });
  it('should be thrown unauthorized exception true when authVerifyApiKey was be called canActive function but without api key', async () => {
    const context: ExecutionContext = {
      switchToHttp: () => context,
      getArgs: () => [
        {
          headers: {},
        },
      ],
      getRequest: () => {},
      getResponse: () => {},
    } as unknown as ExecutionContext;
    await expect(authVerifyApiKey.canActivate(context)).rejects.toThrow('Unauthorized');
  });
});
