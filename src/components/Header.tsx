"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/content";

function LangToggle() {
  const { lang, setLang } = useLang();
  const base =
    "px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.18em] transition-colors duration-200";
  const active = "bg-ink text-paper";
  const idle = "text-ink/50 hover:text-ink";

  const btn = (l: Lang) => (
    <button
      key={l}
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      aria-label={l === "en" ? "Switch to English" : "Cambiar a español"}
      className={`${base} ${lang === l ? active : idle}`}
    >
      {l.toUpperCase()}
    </button>
  );

  return (
    <div className="flex items-stretch border border-ink/25">
      {btn("en")}
      {btn("es")}
    </div>
  );
}

export function Header() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <a
          href="#top"
          className="group font-display text-sm font-semibold uppercase tracking-[0.14em]"
        >
          {t.brand}
          <span className="ml-1 inline-block text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-[11px] uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <LangToggle />
      </div>

      {/* Mobile nav row */}
      <nav
        className="flex items-center gap-6 overflow-x-auto border-t border-ink/10 px-5 py-2.5 lg:hidden"
        aria-label="Primary mobile"
      >
        {t.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap font-display text-[11px] uppercase tracking-[0.18em] text-ink/60 hover:text-ink"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
