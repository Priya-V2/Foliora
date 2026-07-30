import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../generated/prisma';

export const ROLES_KEY = 'roles';

// Marks a route/controller with the roles allowed to access it. Read by
// RolesGuard, which must run after JwtAuthGuard so request.user exists.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
