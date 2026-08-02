// Shared branded shell for all outgoing auth emails (verification today;
// password reset / welcome / OAuth welcome later). Individual templates only
// provide their inner content — the header, footer, and inline styling stay
// in one place so every email looks consistent.

export interface EmailLayoutOptions {
  /** Hidden preheader text shown by email clients next to the subject line. */
  previewText: string;
  /** Public app URL the branding header links to. */
  appUrl: string;
  /** Inner HTML for the email body card. */
  bodyHtml: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderEmailLayout({
  previewText,
  appUrl,
  bodyHtml,
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Foliora</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background-color:#4f46e5;padding:28px 32px;text-align:center;">
                <a href="${appUrl}" style="color:#ffffff;text-decoration:none;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Foliora</a>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#1f2937;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#f9fafb;text-align:center;border-top:1px solid #f0f0f0;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Foliora. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
