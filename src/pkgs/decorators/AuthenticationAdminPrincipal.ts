import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { roleType } from '@prisma/client';
import { AuthUserDto } from '../../domain/auth/AuthUserDto';
import { NotFoundException } from '../exceptions/NotFoundException';

export const AuthenticationAdminPrincipal = createParamDecorator(
  (data: string, context: ExecutionContext): AuthUserDto => {
    const [request] = context.getArgs();
    const user = <AuthUserDto>request.user;

    if (!user || !user.roles.includes(roleType.ADMIN)) {
      throw new NotFoundException('Admin', 'Admin not found');
    }
    return user;
  },
);
