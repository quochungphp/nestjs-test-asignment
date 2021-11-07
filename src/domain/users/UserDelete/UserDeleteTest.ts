import { HttpStatus, INestApplication } from '@nestjs/common';
import { roleType } from '@prisma/client';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RedisService } from '../../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../../pkgs/IdGeneratorService';
import { deleteUsers, tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
import { hashAndValidatePassword } from '../hashUser';
import { setupTestUsersController } from '../setupTesUsersController';

describe('UserController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let redisService: RedisService;
  let idGeneratorService: IdGeneratorService;
  const userIds: bigint[] = [];
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
    await deleteUsers(prismaService, userIds);
  });

  describe('PUT /user', () => {
    it('should return successful when admin delete user', async () => {
      const mockUser = {
        username: 'admin-test',
        password: '123456@',
        name: 'Admin Test',
      };

      const { username, password } = mockUser;
      const { saltRounds } = configService;
      const hashPass = await hashAndValidatePassword(password, saltRounds);
      const adminId = await idGeneratorService.getId();
      userIds.push(adminId);
      await prismaService.users.create({
        data: {
          id: adminId,
          ...mockUser,
          password: hashPass,
          roleType: roleType.ADMIN,
        },
      });
      const userId = await idGeneratorService.getUserId();
      await prismaService.users.createMany({
        data: [
          {
            id: userId,
            username: 'admin-test-1',
            password: '123456@',
            name: 'admin-test-1',
            roleType: roleType.USER,
          },
          {
            username: 'admin-test-2',
            password: '123456@',
            name: 'admin-test-2',
            roleType: roleType.USER,
          },
          {
            username: 'admin-test-3',
            password: '123456@',
            name: 'admin-test-3',
            roleType: roleType.USER,
          },
        ],
      });

      const responseSignin = await request(app.getHttpServer()).post('/auth').send({
        username,
        password: '123456@',
      });

      const { accesstoken } = responseSignin.headers;
      expect(responseSignin.status).toBe(HttpStatus.OK);
      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .send();

      expect(response.status).toEqual(200);
    });
  });
});
