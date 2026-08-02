import { registerAs } from '@nestjs/config';

// Centralized mail/SMTP configuration, mirroring the pattern in auth.config.ts.
// EmailService reads its settings from here instead of touching process.env
// directly, so swapping providers later only means changing these values.
export default registerAs('mail', () => ({
  smtp: {
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT ?? 587),
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  from: {
    name: process.env.MAIL_FROM_NAME ?? 'Foliora',
    address: process.env.MAIL_FROM_ADDRESS,
  },
  // Public app URL used to build links inside outgoing emails (verification,
  // password reset, ...). Distinct from auth.frontendUrl so email links can
  // be repointed independently of the CORS/redirect configuration.
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
}));
