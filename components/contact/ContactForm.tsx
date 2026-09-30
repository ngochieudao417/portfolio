"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Pending";
import { profile } from "@/content/profile";
import { CONTACT_LIMITS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact/validation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Direct-contact fallback — used when the form is unconfigured or delivery fails.
 * The full contact list sits next to the form, so this only offers the fastest routes.
 */
function DirectContact({ title, message }: { title?: string; message: string }) {
  const { t } = useI18n();
  const hasRoute = Boolean(profile.email || profile.socials.linkedin);
  return (
    <div className="rounded-lg border border-line bg-surface-2/50 p-4">
      {title && <p className="font-mono text-sm font-semibold text-fg">{title}</p>}
      {hasRoute ? (
        <>
          <p className="mt-1 text-sm text-muted">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.email && (
              <ButtonLink href={`mailto:${profile.email}`} variant="primary" size="md">
                <Icon name="mail" size={16} />
                {profile.email}
              </ButtonLink>
            )}
            {profile.socials.linkedin && (
              <ButtonLink href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" variant="secondary" size="md">
                <Icon name="linkedin" size={16} />
                {t.common.linkedin}
                <span className="sr-only">{t.common.newTab}</span>
              </ButtonLink>
            )}
          </div>
        </>
      ) : (
        <Pending className="mt-3" what="email / LinkedIn — no contact channel is configured" where="content/profile.ts" />
      )}
    </div>
  );
}

export function ContactForm({ enabled, nameInputId }: { enabled: boolean; nameInputId: string }) {
  const { t } = useI18n();
  const f = t.contact.form;
  const [values, setValues] = useState<ContactInput>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!enabled) {
    return <DirectContact title={f.unavailableTitle} message={f.unavailable} />;
  }

  const update = (field: keyof ContactInput, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = (["name", "email", "message"] as const).find((field) => result.errors[field]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: honeypot }),
      });
      if (response.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
        return;
      }
      const payload = (await response.json().catch(() => null)) as { error?: string; fields?: ContactErrors } | null;
      if (response.status === 422 && payload?.fields) {
        setErrors(payload.fields);
        setStatus("idle");
        return;
      }
      setServerError(response.status === 429 ? f.errors.rateLimited : f.error);
      setStatus("error");
    } catch {
      setServerError(f.error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-[var(--accent-seo)] bg-[color-mix(in_oklab,var(--accent-seo)_8%,transparent)] p-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-seo)] text-bg">
          <Icon name="check" size={16} />
        </span>
        <p className="text-sm text-fg">{f.success}</p>
      </div>
    );
  }

  const field = (name: keyof ContactInput) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: cn(
      "w-full rounded-lg border bg-bg px-3.5 py-2.5 text-[0.9375rem] text-fg placeholder:text-subtle transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[color:var(--focus)]",
      errors[name] ? "border-danger" : "border-line-strong hover:border-subtle",
    ),
  });

  const errorText = (name: keyof ContactInput) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
        <Icon name="close" size={13} />
        {f.errors[errors[name]!]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby="contact-privacy">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameInputId} className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {f.name}
          </label>
          <input
            {...field("name")}
            id={nameInputId}
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            placeholder={f.namePlaceholder}
            onChange={(event) => update("name", event.target.value)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {f.email}
          </label>
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email}
            placeholder={f.emailPlaceholder}
            onChange={(event) => update("email", event.target.value)}
          />
          {errorText("email")}
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-muted">
          {f.message}
        </label>
        <textarea
          {...field("message")}
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax}
          placeholder={f.messagePlaceholder}
          onChange={(event) => update("message", event.target.value)}
          className={cn(field("message").className, "resize-y")}
        />
        {errorText("message")}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-privacy" className="text-xs text-subtle">
          {f.privacy}
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={status === "sending"}>
          {status === "sending" ? f.sending : f.submit}
          <Icon name="arrowRight" size={16} />
        </Button>
      </div>

      <div aria-live="assertive">
        {status === "error" && serverError && (
          <DirectContact
            message={`${serverError} ${profile.email ? f.errorFallback : ""}`.trim()}
          />
        )}
      </div>
    </form>
  );
}
