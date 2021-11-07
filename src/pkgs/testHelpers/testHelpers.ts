import { roleType } from '@prisma/client';
import { ConfigService } from '../../infrastructure/ConfigService.provider';
import { PrismaService } from '../../infrastructure/PrismaService.provider';

export const tearDownTestData = async (
  prismaService: PrismaService,
  configService: ConfigService,
) => {
  const { isIntegrationTest } = configService;
  if (!isIntegrationTest) {
    return;
  }
  await prismaService.users.deleteMany({
    where: {
      roleType: {
        not: roleType.ADMIN,
      },
    },
  });
};

export const deleteUsers = async (prismaService: PrismaService, ids: bigint[]) => {
  if (ids.length === 0) {
    return;
  }
  await prismaService.users.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
