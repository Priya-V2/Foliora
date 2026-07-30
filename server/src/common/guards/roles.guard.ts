import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../generated/prisma';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Authorization only: assumes JwtAuthGuard has already populated
// request.user. Routes with no @Roles() metadata are allowed through, so
// this guard only restricts endpoints that explicitly opt in.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    return requiredRoles.includes(request.user?.role as UserRole);
  }
}
