"use client";

import { useLang } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-cream/10 bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 font-sans text-[11px] uppercase tracking-[0.25em] text-faint md:flex-row md:items-center md:justify-between md:px-14">
        <a href="#top" className="w-fit transition-colors hover:text-flame">
          ↑ {t.footer.backToTop}
        </a>
        <a href={t.links.cv} className="w-fit transition-colors hover:text-flame">
          {t.footer.cv} ↗
        </a>
        <span className="text-faint/80">
          © {year} {t.brand} — {t.footer.tagline}
        </span>
      </div>
    </footer>
  );
}
