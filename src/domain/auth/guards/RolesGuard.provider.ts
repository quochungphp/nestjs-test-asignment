import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleType } from '@prisma/client';
import { ROLES_KEY } from '../../../pkgs/decorators/Roles';
import { ForbiddenException } from '../../../pkgs/exceptions/ForbiddenException';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<roleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const isAccess = requiredRoles.includes(user.roleType);

    if (isAccess) {
      return true;
    }
    throw new ForbiddenException('Forbidden resource');
  }
}
