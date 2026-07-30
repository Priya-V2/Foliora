import { UserRole } from '../../generated/prisma';

// Shape signed into every access token. `sub` follows the JWT spec
// convention for the subject (the user id) rather than `id`, so the
// payload round-trips correctly through generic JWT tooling later on.
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
