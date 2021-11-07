import FlakeId from 'flake-idgen';
import intformat from 'biguint-format';
import SqlString from 'sqlstring';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../infrastructure/PrismaService.provider';
import { ConfigService } from '../infrastructure/ConfigService.provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function toJSON() {
  return this.toString();
};

@Injectable()
export class IdGeneratorService {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async getId(): Promise<bigint> {
    const flakeIdGen = new FlakeId({
      id: Number.parseInt(new Date().toString(), 10),
      epoch: 1_591_765_800_000,
    }).next();
    const id = BigInt(intformat(flakeIdGen, 'dec'));
    return id;
  }

  async getUserId(): Promise<bigint> {
    const seq = SqlString.escape('public.users_id_seq');
    const id = await this.prismaService.$queryRaw<{ id: bigint }[]>`SELECT nextval(${Prisma.raw(
      seq,
    )}) AS "id" ;`;

    return BigInt(id[0].id);
  }
}
