import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { AuthValidateAction } from './AuthValidateAction.service';

jest.mock('@prisma/client', () => {
  const mockResponse = jest.fn().mockResolvedValue({
    id: BigInt(1),
    name: 'Administrator',
    username: 'admin',
    password: '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62',
    roleType: 'ADMIN',
  });
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        users: {
          findUnique: mockResponse,
        },
      };
    }),
  };
});

describe('AuthValidateAction', () => {
  let authValidateAction: AuthValidateAction;
  const configService = new ConfigService();
  beforeEach(async () => {
    authValidateAction = new AuthValidateAction(new PrismaService(configService));
  });
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('when admin user logins, AuthValidateAction was be called execute function', async () => {
    const response = await authValidateAction.execute('admin', 'password');
    expect(response).toMatchObject({
      id: BigInt(1),
      name: 'Administrator',
      username: 'admin',
      password: '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62',
      roleType: 'ADMIN',
    });
  });
});
