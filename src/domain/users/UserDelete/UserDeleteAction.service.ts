import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../UserGet/UserResponseDto';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { NotFoundException } from '../../../pkgs/exceptions/NotFoundException';

@Injectable()
export class UserDeleteAction {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}

  async execute(context: RequestContext, id: bigint): Promise<UserResponseDto> {
    const checkUser = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!checkUser) {
      throw new NotFoundException('User', 'User not found');
    }

    return this.prismaService.users.delete({
      where: {
        id,
      },
    });
  }
}
