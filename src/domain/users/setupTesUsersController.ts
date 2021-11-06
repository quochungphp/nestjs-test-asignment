import { HttpService, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../infrastructure/ConfigService.provider';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { PrismaService } from '../../infrastructure/PrismaService.provider';
import { RedisService } from '../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../pkgs/IdGeneratorService';
import { LoggerMiddleware } from '../../pkgs/middlewares/Logger.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './users.module';

export type SetupTestUsersController = {
  prismaService: PrismaService;
  redisService: RedisService;
  configService: ConfigService;
  httpService: HttpService;
  idGeneratorService: IdGeneratorService;
  app: INestApplication;
};

export async function setupTestUsersController(): Promise<SetupTestUsersController> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [InfrastructureModule, UserModule, AuthModule],
  }).compile();
  const prismaService = moduleFixture.get<PrismaService>(PrismaService);
  const httpService = moduleFixture.get<HttpService>(HttpService);
  const redisService = moduleFixture.get<RedisService>(RedisService);
  const configService = new ConfigService();

  const idGeneratorService = moduleFixture.get<IdGeneratorService>(IdGeneratorService);

  const app = moduleFixture.createNestApplication();
  app.use(new LoggerMiddleware().use);
  await app.init();

  return {
    prismaService,
    configService,
    redisService,
    httpService,
    idGeneratorService,
    app,
  };
}
