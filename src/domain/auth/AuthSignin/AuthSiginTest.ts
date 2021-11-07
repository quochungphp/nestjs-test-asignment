import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
import { hashPassword } from '../../users/hashUser';
import { setupTestAuthController } from '../setupTesAuthController';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeAll(async () => {
    const appContext = await setupTestAuthController();
    app = appContext.app;
    prismaService = appContext.prismaService;
    configService = appContext.configService;
  });
  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });
  afterEach(async () => {
    await tearDownTestData(prismaService, configService);
  });

  describe('POST /auth/signin', () => {
    it('should return successful when user get register and signin', async () => {
      const { apiKey } = configService;
      const mockUser = {
        username: 'user-test-1',
        password: '123456@',
        name: 'User Test',
      };
      const { username, password } = mockUser;
      const passHash = await hashPassword(password, username);
      await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({ ...mockUser, password: passHash });

      const responseSignin = await request(app.getHttpServer()).post('/auth').send({
        username,
        password: passHash,
      });

      const headerRefreshToken = responseSignin.headers.refreshtoken;
      const headerAccessToken = responseSignin.headers.accesstoken;
      expect(responseSignin.status).toBe(200);

      expect(headerRefreshToken).toBeDefined();
      expect(headerRefreshToken).not.toBe('');

      expect(headerAccessToken).toBeDefined();
      expect(headerAccessToken).not.toBe('');

      expect(responseSignin.body).toMatchObject({
        id: expect.any(String),
        name: 'User Test',
        roleType: 'USER',
        sessionId: expect.any(String),
      });
    });

    it('should be thrown error exception of user login when user logins password', async () => {
      const { apiKey } = configService;
      const mockUser = {
        username: 'user-test-1',
        password: '123456@',
        name: 'User Test',
      };
      const { username, password } = mockUser;
      const passHash = await hashPassword(password, username);
      await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({ ...mockUser, password: passHash });
      const responseSignin = await request(app.getHttpServer()).post('/auth').send({
        username,
        password: '123456789',
      });

      expect(responseSignin.status).toEqual(401);
      expect(responseSignin.body).toMatchObject({
        statusCode: 401,
        message: 'Username and password are not correct',
      });
    });
  });
});
