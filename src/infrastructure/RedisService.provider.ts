/* eslint-disable unicorn/prefer-node-protocol */
import { Injectable } from '@nestjs/common';
import redis from 'redis';
import RedisCluster from 'redis-clustr';
import { promisify } from 'util';
import { ConfigService } from './ConfigService.provider';

type PromisifyHmset = <T>(...arguments_: [string, ...(string | number)[]]) => Promise<T>;
@Injectable()
export class RedisService {
  private redisInstance: redis.RedisClient;

  constructor(configService: ConfigService) {
    const {
      redisHost,
      redisPort,
      redisClusterHost,
      redisClusterPort,
      redisClusterSlaveRead,
      isRedisCluster,
    } = configService;
    if (!isRedisCluster) {
      this.redisInstance = redis.createClient({
        host: redisHost,
        port: redisPort,
      });
    } else {
      const options: any = {
        servers: [
          {
            host: redisClusterHost,
            port: redisClusterPort,
          },
        ],
        slaves: redisClusterSlaveRead,
      };

      if (redisClusterSlaveRead === 'nats_cluster') {
        // to override default behavior
        options.createClient = (port: number, host: string): redis.RedisClient => {
          return redis.createClient({
            host: redisHost,
            port,
          });
        };
      }
      this.redisInstance = new RedisCluster(options);
    }
  }

  async promisifyEval<T>(...arguments_: [string, ...(string | number)[]]): Promise<any> {
    const promisifyEvalInstance: PromisifyHmset = promisify(this.redisInstance.eval).bind(
      this.redisInstance,
    );
    return promisifyEvalInstance(...arguments_);
  }

  async flushAll(): Promise<void> {
    this.redisInstance.flushall();
  }

  getRedis() {
    return this.redisInstance;
  }
}
