/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { AppModule } from './app.module';
import { ConfigService } from './infrastructure/ConfigService.provider';
import { bootstrapApp } from './pkgs/bootstrapApp';
import { rootLogger } from './pkgs/Logger';

dotenvExpand(config());

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  bootstrapApp(app);
  const { port, environment, host } = new ConfigService();

  const logMessage = `api server started host: ${host}:${port} `;
  await (environment === 'production'
    ? app
        .listen(port, () => {
          rootLogger.info({ port }, logMessage);
        })
        .catch((error) => {
          rootLogger.fatal(
            {
              err: error,
              errorStack: error.stack,
            },
            'fail to start server',
          );
          process.exit(1);
        })
    : app.listen(port, () => {
        rootLogger.info({ port }, logMessage);
      }));
}
bootstrap();
