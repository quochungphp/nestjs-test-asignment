/* eslint-disable unicorn/no-for-loop */
/* eslint-disable no-continue */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable more/no-then */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './pkgs/middlewares/Logger.middleware';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.use(new LoggerMiddleware().use);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return "OK" when request checks health', async () => {
      const response = await request(app.getHttpServer()).get('/health');
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.text).toEqual('OK');
    });
  });
});
