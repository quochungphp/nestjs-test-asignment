/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line unicorn/prefer-node-protocol
import { promisify } from 'util';
import redis from 'redis';

export type PromisifyRedis = {
  hmset: (arguments_: [string, ...(string | number)[]]) => Promise<'OK'>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  get: (key: string) => Promise<string | null>;
  hget: (key: string, field: string) => Promise<string | null>;
  hmget: (key: string, fields: string[]) => Promise<string[]>;
  set: (key: string, value: string) => Promise<unknown>;
  hset: (argument1: [string, ...string[]]) => Promise<unknown>;
  delete: (key: string | string[]) => Promise<unknown>;
  expire: (key: string, seconds: number) => Promise<unknown>;
  keys: (pattern: string) => Promise<string[] | null>;
  eval: <T>(...arguments_: [string, ...(string | number)[]]) => Promise<T>;
};

export function promisifyRedis(redisClient: redis.RedisClient): PromisifyRedis {
  return {
    hmset: promisify(redisClient.hmset).bind(redisClient),
    hgetall: promisify(redisClient.hgetall).bind(redisClient),
    get: promisify(redisClient.get).bind(redisClient),
    hget: promisify(redisClient.hget).bind(redisClient),
    hmget: promisify(redisClient.hmget).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    hset: promisify(redisClient.hset).bind(redisClient),
    delete: promisify(redisClient.del).bind(redisClient),
    expire: promisify(redisClient.expire).bind(redisClient),
    keys: promisify(redisClient.keys).bind(redisClient),
    eval: promisify(redisClient.eval).bind(redisClient),
  };
}
