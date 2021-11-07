import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { verify } from '../../users/hashUser';
import { NotFoundException } from '../../../pkgs/exceptions/NotFoundException';
import { InvalidCredentialsException } from '../../../pkgs/exceptions/InvalidCredentialsException';
import { UserResponseDto } from '../../users/UserGet/UserResponseDto';

@Injectable()
export class AuthValidateAction {
  constructor(private prismaService: PrismaService) {}

  async execute(username: string, password: string): Promise<UserResponseDto> {
    const user = await this.prismaService.users.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });
    if (user) {
      await this.comparePassword(password, user.password || '');
      return user;
    }

    throw new NotFoundException('User', 'User not found');
  }

  private async comparePassword(password: string, verifyPassword: string): Promise<void> {
    const isComparePassword = await verify(password, verifyPassword);

    if (!isComparePassword) {
      throw new InvalidCredentialsException('Username and password are not correct');
    }
  }
}
