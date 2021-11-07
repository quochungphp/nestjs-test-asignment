import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../UserGet/UserResponseDto';
import { UserUpdatePayloadDto } from './UserUpdatePayloadDto';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';
import { NotFoundException } from '../../../pkgs/exceptions/NotFoundException';

@Injectable()
export class UserUpdateAction {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}

  async execute(context: RequestContext, payload: UserUpdatePayloadDto): Promise<UserResponseDto> {
    const { name, user } = { ...payload, ...context };
    const { id } = user;
    const checkUser = await this.prismaService.users.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!checkUser) {
      throw new NotFoundException('User', 'User not found');
    }

    return this.prismaService.users.update({
      data: {
        name,
      },
      where: {
        id: BigInt(id),
      },
      select: {
        id: true,
        name: true,
        roleType: true,
      },
    });
  }
}
