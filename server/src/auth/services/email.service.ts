import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Provider-agnostic email abstraction. AuthService only ever calls
// `sendVerificationEmail`; swapping the mock for Resend/SES later means
// replacing the body of `dispatch` here, not touching any caller.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = new URL(
      '/verify-email',
      this.configService.getOrThrow<string>('auth.frontendUrl'),
    );
    verificationUrl.searchParams.set('token', token);

    await this.dispatch({
      to,
      subject: 'Verify your Foliora email address',
      body: `Verify your email: ${verificationUrl.toString()}`,
    });
  }

  private dispatch(message: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    // Mock provider: logs instead of sending. Replace this block with a real
    // provider call (Resend, SES, ...) when one is approved.
    this.logger.log(`[mock email] To: ${message.to} | ${message.body}`);
    return Promise.resolve();
  }
}
