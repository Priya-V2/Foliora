import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// Centralizes every bcrypt call in the codebase (see CLAUDE.md's Password
// Service requirement) so hashing/comparison logic and salt-round config
// never gets scattered across auth, users, or OAuth code paths.
@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  hash(plainTextPassword: string): Promise<string> {
    const saltRounds = this.configService.getOrThrow<number>(
      'auth.password.bcryptSaltRounds',
    );
    return bcrypt.hash(plainTextPassword, saltRounds);
  }

  compare(plainTextPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, passwordHash);
  }
}
