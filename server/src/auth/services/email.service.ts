import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import {
  VERIFICATION_EMAIL_SUBJECT,
  renderVerificationEmailHtml,
  renderVerificationEmailText,
} from '../templates/verification-email.template';

interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Provider-agnostic email abstraction backed by Nodemailer + Brevo SMTP.
// AuthService only ever calls `sendVerificationEmail`; swapping providers
// later means changing transporter creation and `send` here, not any caller.
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly fromHeader: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('mail.smtp.host');
    const port = this.configService.getOrThrow<number>('mail.smtp.port');
    const user = this.configService.getOrThrow<string>('mail.smtp.user');
    const pass = this.configService.getOrThrow<string>('mail.smtp.pass');
    const fromName = this.configService.getOrThrow<string>('mail.from.name');
    const fromAddress =
      this.configService.getOrThrow<string>('mail.from.address');

    this.fromHeader = `"${fromName}" <${fromAddress}>`;
    // Created once and reused for every send - Nodemailer transporters pool
    // and keep SMTP connections alive internally.
    this.transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fails loudly to the logs at startup, not the app: a broken mail provider
  // shouldn't stop Foliora from serving requests that don't need email.
  async onModuleInit(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection established');
    } catch (error) {
      this.logger.error(`SMTP connection failed: ${(error as Error).message}`);
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const appUrl = this.configService.getOrThrow<string>('mail.appUrl');
    const expiresInHours = this.configService.getOrThrow<number>(
      'auth.verificationToken.expiresInHours',
    );

    const verificationUrl = new URL('/verify-email', appUrl);
    verificationUrl.searchParams.set('token', token);

    const params = {
      name: deriveDisplayName(to),
      verificationUrl: verificationUrl.toString(),
      expiresInHours,
      appUrl,
    };

    await this.send({
      to,
      subject: VERIFICATION_EMAIL_SUBJECT,
      html: renderVerificationEmailHtml(params),
      text: renderVerificationEmailText(params),
    });
  }

  // Single send path for every email type, so error handling and the `from`
  // header stay consistent as password reset / welcome / OAuth welcome
  // emails are added.
  private async send(message: OutgoingEmail): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromHeader,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${message.to}: ${(error as Error).message}`,
      );
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}

// AuthService only ever passes an email address here, never a display name,
// so the greeting name is best-effort derived from the address's local part.
function deriveDisplayName(email: string): string {
  const localPart = email.split('@')[0] || email;
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
