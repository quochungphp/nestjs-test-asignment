import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/users/users.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { LoggerMiddleware } from './pkgs/middlewares/Logger.middleware';

@Module({
  imports: [InfrastructureModule, AuthModule, UserModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
