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
