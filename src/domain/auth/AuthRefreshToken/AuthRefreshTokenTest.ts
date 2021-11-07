import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RedisService } from '../../../infrastructure/RedisService.provider';
import { tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
import { hashPassword } from '../../users/hashUser';
import { setupTestAuthController } from '../setupTesAuthController';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let configService: ConfigService;

  beforeAll(async () => {
    const appContext = await setupTestAuthController();
    app = appContext.app;
    prismaService = appContext.prismaService;
    redisService = appContext.redisService;
    configService = appContext.configService;
  });

  afterAll(async () => {
    await redisService.flushAll();
    await prismaService.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    await tearDownTestData(prismaService, configService);
  });
  describe('POST /auth/refresh', () => {
    it('should return successful when user refreshes token', async () => {
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
      expect(responseSignin.status).toBe(200);
      const responseRefreshToken = await request(app.getHttpServer()).post('/auth/refresh').send({
        refreshToken: headerRefreshToken,
      });
      expect(responseRefreshToken.status).toEqual(200);
      expect(responseRefreshToken.body).toMatchObject({
        id: expect.any(String),
        name: 'User Test',
        roleType: 'USER',
        sessionId: expect.any(String),
      });
    });

    it('should be thrown expired exception when user refreshes by expired token', async () => {
      const response = await request(app.getHttpServer()).post('/auth/refresh').send({
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMDIzMjA2NTQzMzA0MDg5NjAiLCJzZXNzaW9uSWQiOiJhNWQ2MWM3Yi1hOTU0LTRhYjUtYjc5ZC1hZTU1MTY3OWMyMjgiLCJpYXQiOjE2MjM5MDkyNjgsImV4cCI6MTYyMzkxMjg2OH0.5SX-H62fb4WbQ4SiqXttykzOI_k36sumk9ZI7wVsQ-I',
      });
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('should be thrown internal exception when user verify by expired or incorrect token', async () => {
      const response = await request(app.getHttpServer()).post('/auth/verify').send({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMDIzMjA2NTQzMzA0MDg5NjAiLCJzZXNzaW9uSWQiOiJhNWQ2MWM3Yi1hOTU0LTRhYjUtYjc5ZC1hZTU1MTY3OWMyMjgiLCJpYXQiOjE2MjM5MDkyNjgsImV4cCI6MTYyMzkxMjg2OH0.5SX-H62fb4WbQ4SiqXttykzOI_k36sumk9ZI7wVsQ-I',
      });
      expect(response.status).toEqual(500);
      expect(response.body).toMatchObject({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
  });
});
