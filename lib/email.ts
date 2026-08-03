import { Resend } from "resend";
import { renderBrandedEmail } from "@/lib/emailTemplate";

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const emailProvider = process.env.EMAIL_PROVIDER ?? "auto";
const mailtrapApiToken = process.env.MAILTRAP_API_TOKEN;
const mailtrapFromEmail = process.env.MAILTRAP_FROM_EMAIL;
const mailtrapFromName = process.env.MAILTRAP_FROM_NAME;
const MAILTRAP_SEND_URL = "https://send.api.mailtrap.io/api/send";

const FROM = process.env.EMAIL_FROM ?? "BHAF MarketBridge <noreply@bhaf.example>";

interface EmailPayload {
  to: string;
  subject: string;
  body: string; // plain text
  html?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

function parseFromAddress(value: string) {
  const match = value.match(/^\s*"?([^"<]+?)"?\s*<([^>]+)>\s*$/);
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim(),
    };
  }

  return { email: value.trim() };
}

function getMailtrapFromAddress() {
  if (mailtrapFromEmail) {
    return mailtrapFromName
      ? { email: mailtrapFromEmail.trim(), name: mailtrapFromName.trim() }
      : { email: mailtrapFromEmail.trim() };
  }

  return parseFromAddress(FROM);
}

export async function sendEmail({ to, subject, body, html, ctaLabel, ctaUrl }: EmailPayload): Promise<boolean> {
  const renderedHtml = html ?? renderBrandedEmail({ title: subject, bodyText: body, ctaLabel, ctaUrl });

  async function tryMailtrap() {
    if (!mailtrapApiToken) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(MAILTRAP_SEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Api-Token": mailtrapApiToken,
        },
        body: JSON.stringify({
          from: getMailtrapFromAddress(),
          to: [{ email: to }],
          subject,
          text: body,
          html: renderedHtml,
        }),
        cache: "no-store",
        signal: controller.signal,
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error("[email:mailtrap] failed", response.status, responseText);
        return false;
      }

      try {
        const parsed = JSON.parse(responseText) as {
          success?: boolean;
          message_ids?: string[];
        };
        console.info(
          `[email:mailtrap] accepted to=${to} subject=${JSON.stringify(subject)} messageIds=${parsed.message_ids?.join(",") ?? "none"}`,
        );
      } catch {
        console.info(`[email:mailtrap] accepted to=${to} subject=${JSON.stringify(subject)}`);
      }

      return true;
    } catch (err) {
      console.error("[email:mailtrap] failed", err);
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function tryResend() {
    if (!resendClient) return false;
    try {
      await Promise.race([
        resendClient.emails.send({
          from: FROM,
          to,
          subject,
          text: body,
          html: renderedHtml,
        }),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Resend request timed out.")), 8000);
        }),
      ]);
      return true;
    } catch (err) {
      console.error("[email:resend] failed", err);
      return false;
    }
  }

  const deliveryOrder =
    emailProvider === "resend"
      ? [tryResend]
      : emailProvider === "mailtrap"
      ? [tryMailtrap]
      : [tryMailtrap, tryResend];

  for (const sendWithProvider of deliveryOrder) {
    if (await sendWithProvider()) {
      return true;
    }
  }

  // No provider succeeded — log so devs see what would be sent.
  console.log(`[email:fallback] to=${to} subject="${subject}"\n${body}`);
  return false;
}
