import { HttpService, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../infrastructure/ConfigService.provider';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { PrismaService } from '../../infrastructure/PrismaService.provider';
import { RedisService } from '../../infrastructure/RedisService.provider';
import { IdGeneratorService } from '../../pkgs/IdGeneratorService';
import { LoggerMiddleware } from '../../pkgs/middlewares/Logger.middleware';
import { UserModule } from '../users/users.module';
import { AuthModule } from './auth.module';

export type SetupTestAuthController = {
  prismaService: PrismaService;
  redisService: RedisService;
  configService: ConfigService;
  httpService: HttpService;
  idGeneratorService: IdGeneratorService;
  app: INestApplication;
};

export async function setupTestAuthController(): Promise<SetupTestAuthController> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [InfrastructureModule, AuthModule, UserModule],
  }).compile();
  const prismaService = moduleFixture.get<PrismaService>(PrismaService);
  const httpService = moduleFixture.get<HttpService>(HttpService);
  const configService = new ConfigService();
  const redisService = moduleFixture.get<RedisService>(RedisService);
  const idGeneratorService = moduleFixture.get<IdGeneratorService>(IdGeneratorService);

  const app = moduleFixture.createNestApplication();
  app.use(new LoggerMiddleware().use);
  await app.init();

  return {
    prismaService,
    redisService,
    configService,
    httpService,
    idGeneratorService,
    app,
  };
}
