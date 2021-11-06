declare module 'biguint-format' {
  const format: any;
  export = format;
}

declare module 'redis-clustr' {
  import redis from 'redis';

  class RedisCluster extends redis.RedisClient {
    constructor(config: any);
  }
  export = RedisCluster;
}
