import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { AppRequest } from '../../../pkgs/AppRequest';
import { tokenCacheKey } from '../../../pkgs/cacheKeys';
import { UnauthorizedException } from '../../../pkgs/exceptions/UnauthorizedException';
import { RedisCacheService } from '../../../pkgs/RedisCacheService/RedisCacheService';

@Injectable()
export class AuthBlackListTokenAction {
  constructor(
    private jwtService: JwtService,
    private redisCacheService: RedisCacheService,
    private configService: ConfigService,
  ) {}

  async execute(context: AppRequest): Promise<void> {
    const { authorization } = context.headers;
    const token = authorization?.split(' ')[1];
    try {
      const jwtToken = this.jwtService.verify(token || '');
      const { sessionId, id } = jwtToken;
      const cacheKey = tokenCacheKey(`${sessionId}-${id}`);
      const hasCache = await this.redisCacheService.hasItem(cacheKey);
      const { timeToLive } = this.configService;
      if (!hasCache) {
        await this.redisCacheService.setItem(cacheKey, jwtToken, timeToLive);
        return;
      }
      throw new UnauthorizedException(`Expired session : ${sessionId}`);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}
