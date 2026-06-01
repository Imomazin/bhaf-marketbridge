import { Resend } from "resend";
import { renderBrandedEmail } from "@/lib/emailTemplate";

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "BHAF MarketBridge <noreply@bhaf.example>";

interface EmailPayload {
  to: string;
  subject: string;
  body: string; // plain text
  html?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export async function sendEmail({ to, subject, body, html, ctaLabel, ctaUrl }: EmailPayload): Promise<void> {
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
      html: html ?? renderBrandedEmail({ title: subject, bodyText: body, ctaLabel, ctaUrl }),
    });
  } catch (err) {
    console.error("[email:send] failed", err);
  }
}
