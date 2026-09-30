import type { ContactInput } from "./validation";

/**
 * Delivery abstraction for the contact form. UI components never know which
 * provider is used — it is chosen here from environment variables.
 */
export interface ContactProvider {
  id: string;
  send(message: ContactInput): Promise<void>;
}

function createResendProvider(config: { apiKey: string; to: string; from: string }): ContactProvider {
  return {
    id: "resend",
    async send({ name, email, message }) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          reply_to: email,
          subject: `Portfolio message from ${name}`,
          text: `${message}\n\n— ${name} <${email}>`,
        }),
      });
      if (!response.ok) {
        throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
      }
    },
  };
}

function createWebhookProvider(config: { url: string; secret?: string; to?: string }): ContactProvider {
  return {
    id: "webhook",
    async send(input) {
      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.secret ? { "X-Webhook-Secret": config.secret } : {}),
        },
        body: JSON.stringify({ ...input, to: config.to ?? null, submittedAt: new Date().toISOString() }),
      });
      if (!response.ok) {
        throw new Error(`Webhook responded ${response.status}`);
      }
    },
  };
}

/** Returns null when the form isn't configured — the UI then shows a direct-contact fallback. */
export function getContactProvider(): ContactProvider | null {
  const kind = process.env.CONTACT_PROVIDER?.trim().toLowerCase();
  const to = process.env.CONTACT_EMAIL?.trim();

  if (kind === "resend") {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.CONTACT_FROM_EMAIL?.trim();
    if (!apiKey || !from || !to) return null;
    return createResendProvider({ apiKey, from, to });
  }

  if (kind === "webhook") {
    const url = process.env.CONTACT_WEBHOOK_URL?.trim();
    if (!url) return null;
    return createWebhookProvider({ url, secret: process.env.CONTACT_WEBHOOK_SECRET?.trim(), to });
  }

  return null;
}

export function isContactConfigured(): boolean {
  return getContactProvider() !== null;
}
