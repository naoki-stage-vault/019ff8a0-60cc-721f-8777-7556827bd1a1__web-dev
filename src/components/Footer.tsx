"use client";

import { useLang } from "@/components/LanguageProvider";

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/15">
      <div className="px-5 py-20 md:px-10 md:py-28">
        <p className="mx-auto max-w-[1400px] font-display font-wide uppercase leading-[1.02] tracking-[-0.015em] text-[clamp(2.1rem,5.6vw,4.9rem)]">
          {t.footer.statement}
          <span className="text-accent">↗</span>
        </p>
      </div>

      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <a
            href="#top"
            className="group font-display text-[12px] uppercase tracking-[0.2em] transition-colors hover:text-accent"
          >
            {t.footer.backToTop}
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:-translate-y-1">
              ↑
            </span>
          </a>
          <a
            href={t.links.cv}
            className="group font-display text-[12px] uppercase tracking-[0.2em] transition-colors hover:text-accent"
          >
            {t.footer.cv}
            <Arrow className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-5 font-display text-[10px] uppercase tracking-[0.2em] text-ink/50 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <span>
            {t.brand} — {t.footer.tagline}
          </span>
          <span>© {year} Catalina Cob</span>
        </div>
      </div>
    </footer>
  );
}
