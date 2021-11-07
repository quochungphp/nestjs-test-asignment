import { HttpStatus, INestApplication } from '@nestjs/common';
import { roleType } from '@prisma/client';
import request from 'supertest';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RedisService } from '../../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../../pkgs/IdGeneratorService';
import { deleteUsers, tearDownTestData } from '../../../pkgs/testHelpers/testHelpers';
import { hashAndValidatePassword } from '../../users/hashUser';
import { setupTestAuthController } from '../setupTesAuthController';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let redisService: RedisService;
  let idGeneratorService: IdGeneratorService;
  const userIds: bigint[] = [];

  beforeAll(async () => {
    const appContext = await setupTestAuthController();
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

  describe('DELETE /auth', () => {
    it('should return expired session after user logout', async () => {
      const mockUser = {
        username: 'admin-test',
        password: '123456@',
        name: 'Admin Test',
      };

      const { username, password } = mockUser;
      const { saltRounds } = configService;
      const hashPass = await hashAndValidatePassword(password, saltRounds);
      const userId = await idGeneratorService.getId();
      userIds.push(userId);
      await prismaService.users.create({
        data: {
          id: userId,
          ...mockUser,
          password: hashPass,
          roleType: roleType.ADMIN,
        },
      });

      const responseSignin = await request(app.getHttpServer()).post('/auth').send({
        username,
        password: '123456@',
      });
      expect(responseSignin.status).toBe(HttpStatus.OK);

      const { accesstoken } = responseSignin.headers;
      const { sessionId } = responseSignin.body;
      const responseLogout = await request(app.getHttpServer())
        .delete('/auth')
        .set('Authorization', `Bearer ${accesstoken}`)
        .send();
      expect(responseLogout.status).toBe(HttpStatus.OK);

      const responseExpired = await request(app.getHttpServer())
        .delete('/auth')
        .set('Authorization', `Bearer ${accesstoken}`)
        .send();
      expect(responseExpired.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(responseExpired.body).toMatchObject({
        statusCode: 401,
        message: `Expired session : ${sessionId}`,
      });
    });
  });
});
