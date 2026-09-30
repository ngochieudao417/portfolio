"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function NotFoundView() {
  const { t } = useI18n();
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden px-4 pt-16">
      <div aria-hidden="true" className="lab-grid lab-grid-fade absolute inset-0" />
      <div className="relative text-center">
        <p className="font-mono text-6xl font-bold tracking-tight text-fg sm:text-8xl">
          <span className="text-subtle">|</span>404<span className="text-subtle">⟩</span>
        </p>
        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">{t.notFound.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{t.notFound.description}</p>
        <ButtonLink href="/" variant="primary" size="lg" className="mt-8">
          <Icon name="arrowLeft" size={16} />
          {t.notFound.home}
        </ButtonLink>
      </div>
    </section>
  );
}
