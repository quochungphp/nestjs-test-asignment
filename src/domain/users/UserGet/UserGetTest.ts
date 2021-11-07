import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RedisService } from '../../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../../pkgs/IdGeneratorService';
import { tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
import { hashPassword } from '../hashUser';
import { setupTestUsersController } from '../setupTesUsersController';

describe('UserController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let redisService: RedisService;
  let idGeneratorService: IdGeneratorService;

  beforeAll(async () => {
    const appContext = await setupTestUsersController();
    app = appContext.app;
    prismaService = appContext.prismaService;
    redisService = appContext.redisService;
    configService = appContext.configService;
    idGeneratorService = appContext.idGeneratorService;
  });

  afterAll(async () => {
    await redisService.flushAll();
    await prismaService.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    await tearDownTestData(prismaService, configService);
  });

  describe('GET /user/:id', () => {
    it('should return successful when user get info with role is member', async () => {
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
      const { id } = responseSignin.body;

      const { accesstoken } = responseSignin.headers;
      expect(responseSignin.status).toBe(HttpStatus.OK);
      const response = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .send();
      expect(response.status).toEqual(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: 'User Test',
        roleType: 'USER',
      });
    });
  });
});
