/** Shared by the contact form (client) and the API route (server). */

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactErrorCode =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "messageShort"
  | "messageLong";

export type ContactErrors = Partial<Record<keyof ContactInput, ContactErrorCode>>;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  messageMin: 10,
  messageMax: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(raw: unknown):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors } {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const name = String(source.name ?? "").trim().slice(0, CONTACT_LIMITS.name);
  const email = String(source.email ?? "").trim().slice(0, CONTACT_LIMITS.email);
  const message = String(source.message ?? "").trim();

  const errors: ContactErrors = {};
  if (!name) errors.name = "nameRequired";
  if (!email) errors.email = "emailRequired";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "emailInvalid";
  if (!message) errors.message = "messageRequired";
  else if (message.length < CONTACT_LIMITS.messageMin) errors.message = "messageShort";
  else if (message.length > CONTACT_LIMITS.messageMax) errors.message = "messageLong";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}
