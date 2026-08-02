import { escapeHtml, renderEmailLayout } from './base-email.template';

export const VERIFICATION_EMAIL_SUBJECT = 'Verify your email address';

export interface VerificationEmailParams {
  name: string;
  verificationUrl: string;
  expiresInHours: number;
  appUrl: string;
}

export function renderVerificationEmailHtml({
  name,
  verificationUrl,
  expiresInHours,
  appUrl,
}: VerificationEmailParams): string {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(verificationUrl);

  const bodyHtml = `
    <p style="margin:0 0 16px;">Hello ${safeName},</p>
    <p style="margin:0 0 16px;">Welcome to Foliora. Click the button below to verify your email address.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr>
        <td style="border-radius:8px;background-color:#4f46e5;">
          <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Verify Email</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="margin:0 0 24px;word-break:break-all;"><a href="${safeUrl}" style="color:#4f46e5;">${safeUrl}</a></p>
    <p style="margin:0 0 16px;color:#6b7280;font-size:13px;">This verification link expires in ${expiresInHours} hours.</p>
    <p style="margin:0;color:#6b7280;font-size:13px;">If you didn't create this account, you can safely ignore this email.</p>
  `;

  return renderEmailLayout({
    previewText: 'Verify your email to get started with Foliora.',
    appUrl,
    bodyHtml,
  });
}

export function renderVerificationEmailText({
  name,
  verificationUrl,
  expiresInHours,
}: VerificationEmailParams): string {
  return [
    `Hello ${name},`,
    '',
    'Welcome to Foliora.',
    '',
    `Verify your email: ${verificationUrl}`,
    '',
    `This link expires in ${expiresInHours} hours.`,
    '',
    "If you didn't create this account, you can safely ignore this email.",
  ].join('\n');
}
