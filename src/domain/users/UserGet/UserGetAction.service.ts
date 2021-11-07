import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { RequestContext } from '../../../pkgs/RequestContext';
import { UserResponseDto } from './UserResponseDto';

@Injectable()
export class UserGetAction {
  constructor(private prismaService: PrismaService) {}

  async execute(context: RequestContext, id: bigint): Promise<UserResponseDto> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        roleType: true,
      },
      rejectOnNotFound: false,
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('User', 'User not found');
  }
}
