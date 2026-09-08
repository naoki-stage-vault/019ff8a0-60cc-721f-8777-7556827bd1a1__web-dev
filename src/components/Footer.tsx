"use client";

import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

export function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-cream/10 bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 font-sans text-[11px] uppercase tracking-[0.25em] text-faint md:flex-row md:items-center md:justify-between md:px-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <a href={`/${lang}#top`} className="w-fit transition-colors hover:text-flame">
            {t.footer.backToTop}
          </a>
          <a href={t.links.cv} className="w-fit transition-colors hover:text-flame">
            {t.footer.cv}
          </a>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
            {t.footer.bestWay}
          </p>
          <a
            href={t.links.email}
            className="block break-all font-display text-xl text-cream underline decoration-flame decoration-2 underline-offset-8 transition-colors hover:text-flame md:text-2xl"
          >
            {t.links.email.replace("mailto:", "")}
          </a>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
            {t.footer.online}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={t.links.linkedin}
              className="group inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-flame"
            >
              {t.footer.linkedin}
              <Arrow className="text-flame" />
            </a>
            <a
              href={t.links.github}
              className="group inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-flame"
            >
              {t.footer.github}
              <Arrow className="text-flame" />
            </a>
          </div>
        </div>
        <span className="text-faint/80">
          {t.footer.copyright}
        </span>
      </div>
    </footer>
  );
}
