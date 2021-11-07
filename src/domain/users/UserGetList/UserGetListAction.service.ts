import { Injectable } from '@nestjs/common';
import SqlString from 'sqlstring';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { UserResponseDto } from '../UserGet/UserResponseDto';

@Injectable()
export class UserGetListAction {
  constructor(private prismaService: PrismaService) {}

  async execute(
    context: RequestContext,
    name: string,
    page: number,
    limit: number,
  ): Promise<UserResponseDto[]> {
    const { user } = context;
    if (name && name.length > 0) {
      const escapeName = SqlString.escape(`%${name.toLowerCase()}%`);
      const offset = Math.abs(limit * Number(page) - limit);
      const users: UserResponseDto[] = await this.prismaService.$queryRaw`
          SELECT id::TEXT, name, "roleType"::TEXT FROM users u WHERE lower(u."name")
          LIKE ${Prisma.raw(escapeName)}
          AND id <> ${Prisma.raw(user.id.toString())}
          ORDER BY "createdAt" DESC
          LIMIT ${limit}
          OFFSET ${offset}
      `;
      return users;
    }

    return this.prismaService.users.findMany({
      where: {
        id: {
          not: BigInt(user.id),
        },
      },
      select: {
        id: true,
        name: true,
        roleType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: page,
    });
  }
}
