/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };
  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync('.env'));
  }
  private int(value: string | undefined, number: number): number {
    return value
      ? Number.isNaN(Number.parseInt(value))
        ? number
        : Number.parseInt(value)
      : number;
  }

  private bool(value: string | undefined, boolean: boolean): boolean {
    return value === null || value === undefined ? boolean : value === 'true';
  }

  private cors(value: string | undefined): string[] | 'all' {
    if (value === 'all' || value === undefined) {
      return 'all';
    }

    return value ? value.split(',').map((name) => name.trim()) : ['http://localhost:3000'];
  }

  get postgresConnection(): string {
    return this.isIntegrationTest === true
      ? this.envConfig['DATABASE_TEST_URL']
      : this.envConfig['DATABASE_URL'] || '';
  }

  get redisClusterMode(): 'nats_cluster' | 'aws_elasticache' | 'local_cluster' {
    const mode = process.env.REDIS_CLUSTER_MODE || this.envConfig['REDIS_CLUSTER_MODE'] || '';
    if (mode && ['nats_cluster', 'aws_elasticache', 'local_cluster'].includes(mode)) {
      return mode as 'nats_cluster' | 'aws_elasticache' | 'local_cluster';
    }
    return 'local_cluster';
  }

  get redisClusterHost(): string {
    return process.env.REDIS_CLUSTER_HOST || this.envConfig['REDIS_CLUSTER_HOST'] || '127.0.0.1';
  }

  get redisClusterPort(): number {
    return Number(process.env.REDIS_CLUSTER_PORT || this.envConfig['REDIS_CLUSTER_PORT']) || 6000;
  }

  get redisClusterSlaveRead(): string {
    const defaultMode = 'never';
    const redisClusterSlaveRead =
      process.env.REDIS_CLUSTER_SLAVE_READ || this.envConfig['REDIS_CLUSTER_SLAVE_READ'] || '';
    if (!redisClusterSlaveRead) {
      return defaultMode;
    }

    return ['never', 'share', 'always'].includes(redisClusterSlaveRead)
      ? redisClusterSlaveRead
      : defaultMode;
  }
  get apiKey(): string {
    return process.env.API_KEY || this.envConfig['API_KEY'] || '';
  }
  get useRedisCluster(): boolean {
    return (
      (process.env.USE_REDIS_CLUSTER || this.envConfig['USE_REDIS_CLUSTER']) === 'true' || false
    );
  }
  get redisHost(): string {
    return process.env.REDIS_HOST || this.envConfig['REDIS_HOST'] || '';
  }
  get redisPort(): number {
    return process.env.REDIS_PORT || this.envConfig['REDIS_PORT']
      ? Number.parseInt(this.envConfig['REDIS_PORT'], 10)
      : 0;
  }
  get redisPrefix(): string {
    return this.envConfig['INTEGRATION_TESTING'] === 'true' ? 'dbtest' : 'dbtest';
  }
  get jwtSecret(): string {
    return this.envConfig['JWT_SECRET'] || 'test';
  }

  get accessTokenExpiry(): string {
    return this.envConfig['ACCESS_TOKEN_EXPIRY'] || '1h';
  }
  get saltRounds(): number {
    return this.int(this.envConfig['SALT_ROUNDS'], 10);
  }
  get preHashSalt(): string {
    return this.envConfig['PRE_HASH_SALT'] || 'test-hash';
  }
  get isPrismaLogEnabled(): boolean {
    return this.bool(this.envConfig['IS_PRISMA_LOG_ENABLED'], true);
  }

  get host(): string {
    return this.envConfig['HOST'] || '127.0.0.1';
  }
  get port(): number {
    return this.int(this.envConfig['PORT'], 3131);
  }

  get timeToLive(): number {
    return this.int(
      this.envConfig[process.env.REDIS_CACHE_EXPIRES_IN || 'REDIS_CACHE_EXPIRES_IN'],
      60 * 60 * 24 * 7,
    );
  }
  get corsAllowedOrigins(): string[] | string {
    return this.cors(process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ALLOWED_ORIGINS || 'all');
  }
  get corsEnabled(): boolean {
    return this.bool(
      process.env.IS_PRISMA_LOG_ENABLED || this.envConfig['IS_PRISMA_LOG_ENABLED'],
      true,
    );
  }

  get isRedisCluster(): boolean {
    return this.bool(process.env.IS_REDIS_CLUSTER || this.envConfig['IS_REDIS_CLUSTER'], false);
  }

  get isIntegrationTest(): boolean {
    return this.bool(
      process.env.IS_INTEGRATION_TESTING || this.envConfig['IS_INTEGRATION_TESTING'],
      false,
    );
  }

  get environment(): string {
    return process.env.NODE_ENV || this.envConfig['NODE_ENV'] || 'development';
  }
}
