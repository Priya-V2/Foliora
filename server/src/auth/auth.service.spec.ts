import { BadRequestException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { EmailService } from './services/email.service';
import { SessionService } from './services/session.service';
import { UserRole } from '../generated/prisma';

// @types/jest declares `expect.any()` as returning `any`; asserting it back
// to `Date` here keeps the object literals below out of
// @typescript-eslint/no-unsafe-assignment without weakening the check.
const anyDate = expect.any(Date) as unknown as Date;

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    verificationToken: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let passwordService: { hash: jest.Mock };
  let tokenService: {
    generateVerificationToken: jest.Mock;
    hashToken: jest.Mock;
  };
  let emailService: { sendVerificationEmail: jest.Mock };

  const baseUser = {
    id: 'user_1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHash: 'hashed',
    provider: 'LOCAL',
    role: UserRole.USER,
    isVerified: false,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      verificationToken: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      // Mirrors how SessionService's tests would stub $transaction: invoke
      // the callback with a `tx` that just reuses the same mocked client,
      // since none of these tests assert on transactional isolation itself.
      $transaction: jest.fn((arg: unknown) => {
        if (typeof arg === 'function') {
          return (arg as (tx: unknown) => unknown)(prisma);
        }
        return Promise.all(arg as Promise<unknown>[]);
      }),
    };
    passwordService = { hash: jest.fn().mockResolvedValue('hashed') };
    tokenService = {
      generateVerificationToken: jest.fn().mockReturnValue({
        token: 'raw-token',
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 3_600_000),
      }),
      hashToken: jest.fn((raw: string) => `hashed(${raw})`),
    };
    emailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    };

    authService = new AuthService(
      prisma as unknown as PrismaService,
      passwordService as unknown as PasswordService,
      tokenService as unknown as TokenService,
      emailService as unknown as EmailService,
      {} as SessionService,
    );
  });

  describe('register', () => {
    it('rejects when the email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser);

      await expect(
        authService.register({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Str0ngPass!',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('commits the user and returns success when SMTP succeeds', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(baseUser);
      prisma.verificationToken.create.mockResolvedValue({});

      const result = await authService.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Str0ngPass!',
      });

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          passwordHash: 'hashed',
        },
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        'jane@example.com',
        'raw-token',
      );
      expect(result.message).toContain('Registration successful');
      expect(result.user.email).toBe('jane@example.com');
    });

    it('still returns success when SMTP fails, without rolling back the user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(baseUser);
      prisma.verificationToken.create.mockResolvedValue({});
      emailService.sendVerificationEmail.mockRejectedValue(
        new Error('SMTP connection timed out'),
      );

      const result = await authService.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Str0ngPass!',
      });

      // The DB transaction already committed before the email attempt, so a
      // failed send must not surface as a thrown error to the caller.
      expect(result.message).toContain("couldn't send the verification email");
      expect(result.user.email).toBe('jane@example.com');
      // No raw SMTP detail should leak into the response.
      expect(result.message).not.toContain('SMTP connection timed out');
    });
  });

  describe('resendVerification', () => {
    it('returns the generic message for an unknown email without touching tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.resendVerification({
        email: 'nobody@example.com',
      });

      expect(result.message).toContain('If an account exists');
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('returns the same generic message for an already-verified account', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        isVerified: true,
      });

      const result = await authService.resendVerification({
        email: 'jane@example.com',
      });

      expect(result.message).toContain('If an account exists');
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('invalidates existing unused tokens and issues a new one', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser);
      prisma.verificationToken.updateMany.mockResolvedValue({ count: 1 });
      prisma.verificationToken.create.mockResolvedValue({});

      const result = await authService.resendVerification({
        email: 'jane@example.com',
      });

      expect(prisma.verificationToken.updateMany).toHaveBeenCalledWith({
        where: { userId: baseUser.id, usedAt: null },
        data: { usedAt: anyDate },
      });
      expect(prisma.verificationToken.create).toHaveBeenCalledWith({
        data: {
          userId: baseUser.id,
          tokenHash: 'hashed-token',
          expiresAt: anyDate,
        },
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        'jane@example.com',
        'raw-token',
      );
      expect(result.message).toContain('If an account exists');
    });

    it('still returns the generic success message when SMTP fails', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser);
      prisma.verificationToken.updateMany.mockResolvedValue({ count: 1 });
      prisma.verificationToken.create.mockResolvedValue({});
      emailService.sendVerificationEmail.mockRejectedValue(
        new Error('SMTP down'),
      );

      const result = await authService.resendVerification({
        email: 'jane@example.com',
      });

      expect(result.message).toContain('If an account exists');
    });
  });

  describe('verifyEmail', () => {
    it('accepts a freshly issued, unused token', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue({
        id: 'vt_new',
        userId: baseUser.id,
        tokenHash: 'hashed(new-raw-token)',
        usedAt: null,
        expiresAt: new Date(Date.now() + 3_600_000),
        createdAt: new Date(),
      });

      const result = await authService.verifyEmail({ token: 'new-raw-token' });

      expect(result.message).toBe('Email verified successfully');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { isVerified: true },
      });
      expect(prisma.verificationToken.update).toHaveBeenCalledWith({
        where: { id: 'vt_new' },
        data: { usedAt: anyDate },
      });
    });

    // Simulates the token that resendVerification invalidates (usedAt set) -
    // presenting it after a resend must fail, not silently verify the account.
    it('rejects a token that was invalidated by a resend', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue({
        id: 'vt_old',
        userId: baseUser.id,
        tokenHash: 'hashed(old-raw-token)',
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 3_600_000),
        createdAt: new Date(),
      });

      await expect(
        authService.verifyEmail({ token: 'old-raw-token' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects an unknown token', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue(null);

      await expect(
        authService.verifyEmail({ token: 'nonexistent' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
