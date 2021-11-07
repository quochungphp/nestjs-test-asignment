import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './ConfigService.provider';
import { RedisService } from './RedisService.provider';
import { PrismaService } from './PrismaService.provider';
import { IdGeneratorService } from '../pkgs/IdGeneratorService';

const configService = new ConfigService();
const { jwtSecret, accessTokenExpiry } = configService;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: accessTokenExpiry },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule.register({}),
  ],
  exports: [ConfigService, RedisService, JwtModule, PrismaService, HttpModule, IdGeneratorService],
  providers: [ConfigService, RedisService, PrismaService, IdGeneratorService],
})
export class InfrastructureModule {}
