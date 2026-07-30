import { registerAs } from '@nestjs/config';

// Centralized authentication configuration (see docs/security.md and the
// Milestone 1 architecture brief). Every future auth feature reads its
// tunables from here instead of touching process.env or hardcoding values.
export default registerAs('auth', () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    // Seconds, not a "30m"-style string: keeps this a plain `number`, which
    // is what @nestjs/jwt's JwtSignOptions.expiresIn accepts without an
    // unnecessary type assertion against the `ms` package's strict
    // StringValue union.
    accessExpiresInSeconds: Number(
      process.env.JWT_ACCESS_EXPIRES_IN_SECONDS ?? 1800,
    ),
  },
  refreshToken: {
    cookieName: process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refresh_token',
    // Sliding session: each refresh extends the token by this many days.
    expiresInDays: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 7),
    // Absolute session lifetime: a session can never be extended past this,
    // regardless of how many times it has been refreshed.
    absoluteLifetimeDays: Number(
      process.env.REFRESH_TOKEN_ABSOLUTE_LIFETIME_DAYS ?? 90,
    ),
  },
  verificationToken: {
    expiresInHours: Number(
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_HOURS ?? 24,
    ),
  },
  passwordResetToken: {
    expiresInMinutes: Number(
      process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES ?? 30,
    ),
  },
  password: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
    minLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 8),
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: process.env.NODE_ENV === 'production',
  },
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:4000',
  // Scoped to auth endpoints only (register/login/reset) - not a global
  // app-wide rate limit. See AuthModule's ThrottlerModule registration.
  rateLimit: {
    ttlMs: Number(process.env.AUTH_RATE_LIMIT_TTL_MS ?? 60_000),
    limit: Number(process.env.AUTH_RATE_LIMIT_LIMIT ?? 10),
  },
}));
