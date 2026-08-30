"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/content";

export function Header() {
  const { t, lang, setLang } = useLang();

  const btn = (l: Lang) => (
    <button
      key={l}
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      aria-label={l === "en" ? "Switch to English" : "Cambiar a español"}
      className={`px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
        lang === l ? "bg-flame text-ink" : "text-dim hover:text-cream"
      }`}
    >
      {l}
    </button>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-14">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-display text-lg tracking-tight"
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-flame transition-transform duration-300 group-hover:scale-150"
            aria-hidden
          />
          {t.brand}
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="hidden font-sans text-[11px] uppercase tracking-[0.25em] text-dim transition-colors hover:text-flame sm:block"
          >
            {t.hero.cta} ↗
          </a>
          <div className="flex items-stretch overflow-hidden border border-cream/20">
            {btn("en")}
            {btn("es")}
          </div>
        </div>
      </div>
    </header>
  );
}
