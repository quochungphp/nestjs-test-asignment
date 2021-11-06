import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RedisService } from '../../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../../pkgs/IdGeneratorService';
import { tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
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

  describe('POST /user', () => {
    it('should return throw error validate payload', async () => {
      const { apiKey } = configService;
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({});
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: [
          'username must be a lowercase string',
          'username must be shorter than or equal to 50 characters',
          'password must be longer than or equal to 6 characters',
          'password must be a string',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
        ],
        error: 'Bad Request',
      });
    });
    it('should return successful when requests to create new account', async () => {
      const { apiKey } = configService;
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({
          username: 'dev8',
          password: '123456@',
          name: 'Dev',
        });
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        username: 'dev8',
        name: 'Dev',
        roleType: 'USER',
      });
    });
    it('should return error when requests to create new account has same username', async () => {
      const { apiKey } = configService;
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({
          username: 'dev8',
          password: '123456@',
          name: 'Dev',
        });
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        username: 'dev8',
        name: 'Dev',
        roleType: 'USER',
      });

      const responseDuplicateUser = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({
          username: 'dev8',
          password: '123456@',
          name: 'Dev',
        });
      expect(responseDuplicateUser.status).toEqual(HttpStatus.CONFLICT);
      expect(responseDuplicateUser.body).toMatchObject({
        statusCode: 409,
        message: 'User has already conflicted',
      });
    });
  });
});
