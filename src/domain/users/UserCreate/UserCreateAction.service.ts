import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../UserGet/UserResponseDto';
import { UserCreatePayloadDto } from './UserCreatePayloadDto';
import { hashAndValidatePassword, hashPassword } from '../hashUser';
import { PrismaService } from '../../../infrastructure/PrismaService.provider';
import { UsernameConflictException } from '../../../pkgs/exceptions/UsernameConflictException';
import { RequestContext } from '../../../pkgs/RequestContext';
import { ConfigService } from '../../../infrastructure/ConfigService.provider';

@Injectable()
export class UserCreateAction {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}

  async execute(context: RequestContext, payload: UserCreatePayloadDto): Promise<UserResponseDto> {
    const { username, password, name } = payload;
    const checkUser = await this.prismaService.users.findUnique({
      where: {
        username,
      },
    });

    if (checkUser) {
      throw new UsernameConflictException('User has already conflicted');
    }
    const { saltRounds } = this.configService;
    let hashPass = '';
    if (password) {
      const pass = await hashPassword(password, name);
      hashPass = await hashAndValidatePassword(pass, saltRounds);
    }

    const user = await this.prismaService.users.create({
      data: {
        username,
        password: hashPass,
        name,
      },
      select: {
        id: true,
        username: true,
        name: true,
        roleType: true,
      },
    });

    return user;
  }
}
