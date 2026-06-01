/**
 * Branded HTML email template — wraps any plain-text body in a
 * BHAF MarketBridge look-and-feel so emails feel like the product,
 * not like sysadmin spam.
 */

interface BrandEmailOptions {
  title: string;
  bodyMarkdown?: string;
  bodyText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBody(text: string): string {
  const safe = escape(text).replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  return `<p>${safe}</p>`;
}

export function renderBrandedEmail(opts: BrandEmailOptions): string {
  const body = renderBody(opts.bodyText ?? opts.bodyMarkdown ?? "");
  const cta = opts.ctaLabel && opts.ctaUrl
    ? `<p style="text-align:center;margin:32px 0 0">
        <a href="${escape(opts.ctaUrl)}" style="display:inline-block;background:#0f2620;color:#fcf6e6;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;font-size:13px;letter-spacing:0.02em">
          ${escape(opts.ctaLabel)}
        </a>
       </p>`
    : "";

  const footer = opts.footerNote
    ? `<p style="margin-top:8px;color:#888;font-size:11px">${escape(opts.footerNote)}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escape(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#fcfaf3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a2622">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fcfaf3;padding:24px 0">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;background:#ffffff;border:1px solid #ece4cf;border-radius:14px;overflow:hidden">
          <tr>
            <td style="padding:24px 28px 0">
              <p style="margin:0;color:#7d5410;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase">
                BHAF MarketBridge
              </p>
              <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;color:#072018;line-height:1.25">
                ${escape(opts.title)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 8px;font-size:14px;line-height:1.6;color:#333">
              ${body}
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;border-top:1px solid #ece4cf;background:#fcfaf3">
              <p style="margin:0;color:#666;font-size:11px;line-height:1.6">
                BHAF Circular Academy &amp; Consulting Firm · MarketBridge<br />
                <a href="https://bhaf-marketbridge.vercel.app" style="color:#234638;text-decoration:none">bhaf-marketbridge.vercel.app</a>
              </p>
              ${footer}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;color:#999;font-size:10px">
          You're receiving this because of activity on your BHAF MarketBridge account.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
