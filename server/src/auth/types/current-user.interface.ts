import { UserRole } from '../../generated/prisma';

// The authenticated user as attached to `request.user` by JwtStrategy.
// Deliberately narrower than the full User model: only what guards,
// decorators, and controllers need to authorize a request.
export interface CurrentUserData {
  id: string;
  email: string;
  role: UserRole;
}
