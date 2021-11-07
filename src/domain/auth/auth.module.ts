import { Module } from '@nestjs/common';
import { PassportHeaderApiKeyStrategy } from './strategies/PassportHeaderApiKeyStrategy.provider';
import { AuthController } from './auth.controller';
import { AuthVerifyTokenAction } from './AuthVerifyToken/AuthVerifyTokenAction.service';
import { JwtAuthStrategy } from './strategies/JwtAuthStrategy.provider';
import { LocalAuthStrategy } from './strategies/LocalAuthStrategy.provider';
import { AuthValidateAction } from './AuthValidate/AuthValidateAction.service';
import { AuthRefreshTokenAction } from './AuthRefreshToken/AuthRefreshTokenAction.service';
import { JwtRefreshTokenStrategy } from './strategies/JwtRefreshStrategy.provider';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { AuthSigninAction } from './AuthSignin/AuthSigninAction.service';
import { AuthBlackListTokenAction } from './AuthBlackListToken/AuthBlackListTokenAction.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    PassportHeaderApiKeyStrategy,
    JwtAuthStrategy,
    LocalAuthStrategy,
    JwtRefreshTokenStrategy,
    AuthSigninAction,
    AuthVerifyTokenAction,
    AuthValidateAction,
    AuthRefreshTokenAction,
    AuthBlackListTokenAction,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
