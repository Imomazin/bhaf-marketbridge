import { Resend } from "resend";

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "BHAF MarketBridge <noreply@bhaf.example>";

interface EmailPayload {
  to: string;
  subject: string;
  body: string; // plain text
  html?: string;
}

export async function sendEmail({ to, subject, body, html }: EmailPayload): Promise<void> {
  if (!resendClient) {
    // No provider — log so devs see what would be sent.
    console.log(`[email:fallback] to=${to} subject="${subject}"\n${body}`);
    return;
  }
  try {
    await resendClient.emails.send({
      from: FROM,
      to,
      subject,
      text: body,
      html: html ?? defaultHtml(subject, body),
    });
  } catch (err) {
    console.error("[email:send] failed", err);
  }
}

function defaultHtml(subject: string, body: string): string {
  const safe = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#072018;max-width:560px;margin:0 auto;padding:24px;background:#fcfaf3">
    <h1 style="font-family:Georgia,serif;font-size:20px;color:#072018;margin:0 0 16px">${subject}</h1>
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.5">${safe}</pre>
    <hr style="margin:24px 0;border:0;border-top:1px solid #ece4cf"/>
    <p style="color:#717171;font-size:12px">BHAF Circular Academy &amp; Consulting Firm · MarketBridge</p>
  </body></html>`;
}
