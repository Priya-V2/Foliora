import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUserData } from '../../auth/types/current-user.interface';

// Extracts the authenticated user populated by JwtAuthGuard, e.g.
// `getProfile(@CurrentUser() user: CurrentUserData)`.
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as CurrentUserData;
  },
);
