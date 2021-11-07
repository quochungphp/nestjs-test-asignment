import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '../../infrastructure/RedisService.provider';
import { rootLogger } from '../Logger';
import { promisifyRedis, PromisifyRedis } from './promisifyRedis';

@Injectable()
export class RedisCacheService {
  private readonly redis: PromisifyRedis;

  private readonly logger: typeof rootLogger;

  constructor(@Inject(RedisService) private readonly redisService: RedisService) {
    this.redis = promisifyRedis(redisService.getRedis());
    this.logger = rootLogger;
  }

  async hasItem(key: string): Promise<boolean> {
    const value = await this.redis.get(key);
    return value !== null;
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }

  async setItem<T>(key: string, value: T, secondToLive: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
    await this.redis.expire(key, secondToLive);
  }

  async deleteItems(key: string | string[]): Promise<void> {
    try {
      await this.redis.delete(key);
    } catch (error) {
      this.logger.error(
        {
          err: error,
          errorStack: error.stack,
        },
        'deleteItems fail',
      );
    }
  }
}
