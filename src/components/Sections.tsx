"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Copy, Lang } from "@/lib/content";

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

const UI = {
  en: { processHead: "One clear thread, from first call to launch." },
  es: { processHead: "Un solo hilo, de la primera llamada al lanzamiento." },
} as const;

const SECTION_IDS = [
  "top",
  "positioning",
  "about",
  "build",
  "process",
  "projects",
  "fit",
  "contact",
];

const RAIL_LABELS: Record<string, { en: string; es: string }> = {
  top: { en: "Intro", es: "Portada" },
  positioning: { en: "Positioning", es: "Posicionamiento" },
  about: { en: "About", es: "Sobre mí" },
  build: { en: "What I build", es: "Lo que construyo" },
  process: { en: "Process", es: "Proceso" },
  projects: { en: "Selected work", es: "Trabajo seleccionado" },
  fit: { en: "A good fit", es: "Un buen encaje" },
  contact: { en: "Contact", es: "Contacto" },
};

function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-[11px] uppercase tracking-[0.3em] text-flame ${className}`}
    >
      {children}
    </p>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Slide({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      data-slide
      className="relative flex min-h-svh items-center overflow-hidden px-6 py-24 md:px-14 md:py-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar + chapter rail                                         */
/* ------------------------------------------------------------------ */

function ProgressRail() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? y / h : 0);
        let idx = 0;
        for (let i = 0; i < SECTION_IDS.length; i++) {
          const el = document.getElementById(SECTION_IDS[i]);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
            idx = i;
          }
        }
        setActive(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden>
        <div
          className="h-full bg-flame transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <nav
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-1.5 lg:flex"
        aria-label="Chapters"
      >
        {SECTION_IDS.map((id, i) => {
          const label = RAIL_LABELS[id][lang];
          const isActive = i === active;
          return (
            <a
              key={id}
              href={`#${id}`}
              title={label}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full font-sans text-[10px] tracking-widest transition-all duration-300 ${
                isActive
                  ? "scale-110 bg-flame text-ink"
                  : "text-faint hover:text-cream"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </a>
          );
        })}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · HERO                                                           */
/* ------------------------------------------------------------------ */

function Hero({ t, lang }: { t: Copy; lang: Lang }) {
  const strip = `${t.hero.strip}  ·  ${t.hero.stripSuffix}`;
  const last = lang === "en" ? "look like it." : "reflejarlo.";

  return (
    <Slide id="top">
      <span className="ghost" aria-hidden>
        01
      </span>

      <Reveal>
        <Eyebrow>
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full bg-flame align-middle"
            aria-hidden
          />
          {t.hero.label}
        </Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h1 className="mt-8 font-display text-[clamp(2.8rem,8.2vw,7.4rem)] leading-[0.95] tracking-[-0.02em]">
          <span className="uppercase">{t.hero.titleA}</span>
          <br />
          <em className="text-cream">
            {t.hero.titleB.replace(last, "")}
            <span className="text-flame">{last}</span>
          </em>
        </h1>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-12 flex max-w-3xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md font-serif text-xl leading-relaxed text-dim">
            {t.hero.sub}
          </p>
          <a
            href={t.links.email}
            className="group inline-flex w-fit items-center gap-3 bg-flame px-7 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream"
          >
            {t.hero.cta}
            <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </Reveal>

      <Reveal delay={340}>
        <div className="mt-20 overflow-hidden border-y border-cream/10 py-3">
          <div className="marquee-track font-sans text-[11px] uppercase tracking-[0.3em] text-faint">
            <span className="px-4">{strip}</span>
            <span className="px-4" aria-hidden>
              {strip}
            </span>
            <span className="px-4" aria-hidden>
              {strip}
            </span>
            <span className="px-4" aria-hidden>
              {strip}
            </span>
            <span className="px-4" aria-hidden>
              {strip}
            </span>
            <span className="px-4" aria-hidden>
              {strip}
            </span>
          </div>
        </div>
      </Reveal>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · POSITIONING                                                    */
/* ------------------------------------------------------------------ */

function Positioning({ t, lang }: { t: Copy; lang: Lang }) {
  const p = t.positioning;
  const last = lang === "en" ? "catch up." : "ponerse al día.";

  return (
    <Slide id="positioning">
      <span className="ghost" aria-hidden>
        02
      </span>

      <Reveal>
        <Eyebrow>{p.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 max-w-5xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
          {p.title.replace(last, "")}
          <em className="text-flame">{last}</em>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal delay={160} className="lg:col-span-7">
          <p className="max-w-xl font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug text-dim">
            {p.body}
          </p>
        </Reveal>

        <Reveal delay={240} className="lg:col-span-5">
          <div className="border border-cream/10 bg-raised/30">
            <p className="border-b border-cream/10 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
              {p.glanceTitle}
            </p>
            <dl>
              {p.glance.map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between ${
                    i > 0 ? "border-t border-cream/10" : ""
                  }`}
                >
                  <dt className="shrink-0 font-sans text-[10px] uppercase tracking-[0.2em] text-faint">
                    {label}
                  </dt>
                  <dd className="text-right font-serif text-[15px] leading-snug text-cream">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · ABOUT                                                          */
/* ------------------------------------------------------------------ */

function About({ t }: { t: Copy }) {
  const a = t.about;
  return (
    <Slide id="about">
      <span className="ghost" aria-hidden>
        03
      </span>

      <Reveal>
        <Eyebrow>{a.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <p className="mt-10 max-w-5xl font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.05] tracking-[-0.015em]">
          <em className="text-cream">“{a.statement}”</em>
          <span className="text-flame">.</span>
        </p>
      </Reveal>

      <Reveal delay={180} className="lg:col-span-4 lg:col-start-9">
        <div className="mt-14 w-full max-w-sm border border-cream/10 bg-raised/30 p-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
            {a.name}
          </p>
          <p className="mt-4 font-display text-6xl text-flame">{a.monogram}</p>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-dim">
            {a.note}
          </p>
        </div>
      </Reveal>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · WHAT I BUILD                                                   */
/* ------------------------------------------------------------------ */

function Build({ t }: { t: Copy }) {
  const b = t.build;
  const panels = [
    { tag: b.new.tag, lead: b.new.lead, body: b.new.body },
    { tag: b.rebuild.tag, lead: b.rebuild.lead, body: b.rebuild.body },
  ];

  return (
    <Slide id="build">
      <span className="ghost" aria-hidden>
        04
      </span>

      <Reveal>
        <Eyebrow>{b.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
          {b.title}
        </h2>
        <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-dim">
          {b.intro}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {panels.map((panel, i) => (
          <Reveal key={panel.tag} delay={i * 120}>
            <article className="group flex h-full flex-col justify-between border border-cream/10 bg-raised/30 p-8 transition-colors duration-300 hover:border-flame/50 md:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-flame">
                    {panel.tag}
                  </span>
                  <Arrow className="text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-flame" />
                </div>
                <h3 className="mt-6 font-display text-2xl leading-tight md:text-[1.7rem]">
                  {panel.lead}
                </h3>
              </div>
              <p className="mt-6 font-serif text-[15px] leading-relaxed text-dim">
                {panel.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · PROCESS                                                        */
/* ------------------------------------------------------------------ */

function Process({ t, lang }: { t: Copy; lang: Lang }) {
  const b = t.build;
  const ui = UI[lang];
  return (
    <Slide id="process">
      <Reveal>
        <Eyebrow>{b.processTitle}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.1rem)] leading-[1.05] tracking-[-0.015em]">
          {ui.processHead}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
        {b.process.map((step, i) => (
          <Reveal key={step.n} delay={i * 110}>
            <div className="border-t-2 border-cream/15 pt-6 transition-colors duration-300 hover:border-flame">
              <span className="font-display text-5xl text-flame/90">
                {step.n}
              </span>
              <h3 className="mt-4 font-sans text-sm font-bold uppercase tracking-[0.08em] text-cream">
                {step.t}
              </h3>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                {step.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · SELECTED WORK                                                  */
/* ------------------------------------------------------------------ */

function Projects({ t, lang }: { t: Copy; lang: Lang }) {
  const w = t.work;
  const last = lang === "en" ? "Different websites." : "Sitios web diferentes.";

  return (
    <Slide id="projects">
      <span className="ghost" aria-hidden>
        05
      </span>

      <Reveal>
        <Eyebrow>{w.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
          {w.title.replace(last, "")}
          <em className="text-flame">{last}</em>
        </h2>
        <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-dim">
          {w.intro}
        </p>
      </Reveal>

      <div className="mt-12 border-b border-cream/10">
        {w.projects.map((p, i) => (
          <Reveal key={p.n} delay={i * 60}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group grid gap-3 border-t border-cream/10 py-6 transition-colors duration-200 hover:bg-raised/40 md:grid-cols-12 md:items-center md:gap-6 md:py-7"
            >
              <span className="font-sans text-[11px] tracking-[0.2em] text-faint md:col-span-1">
                {p.n}
              </span>
              <div className="md:col-span-4">
                <h3 className="font-display text-2xl leading-tight transition-colors duration-200 group-hover:text-flame md:text-3xl">
                  {p.name}
                </h3>
                <span className="mt-2 inline-block border border-cream/15 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-dim">
                  {p.cat}
                </span>
              </div>
              <p className="font-serif text-sm leading-snug text-dim md:col-span-5 md:pr-8">
                {p.desc}
              </p>
              <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-cream md:col-span-2 md:text-right">
                <span className="inline-flex items-center gap-2 transition-colors duration-200 group-hover:text-flame">
                  {p.link}
                  <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · A GOOD FIT                                                     */
/* ------------------------------------------------------------------ */

function Fit({ t, lang }: { t: Copy; lang: Lang }) {
  const f = t.fit;
  const last = lang === "en" ? "real change." : "un cambio real.";

  return (
    <Slide id="fit">
      <span className="ghost" aria-hidden>
        06
      </span>

      <Reveal>
        <Eyebrow>{f.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 max-w-5xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
          {f.title.replace(last, "")}
          <em className="text-flame">{last}</em>
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {f.items.map((item, i) => (
          <Reveal key={item.n} delay={i * 90}>
            <article className="h-full border border-cream/10 bg-raised/25 p-7 transition-colors duration-300 hover:border-flame/40 md:p-8">
              <span className="font-sans text-[11px] tracking-[0.2em] text-flame">
                {item.n}
              </span>
              <h3 className="mt-3 font-sans text-lg font-bold uppercase leading-snug tracking-[0.02em] text-cream">
                {item.t}
              </h3>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                {item.d}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · CONTACT                                                        */
/* ------------------------------------------------------------------ */

function Contact({ t }: { t: Copy }) {
  const c = t.contact;
  return (
    <Slide id="contact">
      <span className="ghost" aria-hidden>
        07
      </span>

      <Reveal>
        <Eyebrow>{c.num}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.1rem,5.2vw,4.6rem)] leading-[1.03] tracking-[-0.015em]">
          {c.title.split("?")[0]}
          <em className="text-flame">?</em>
        </h2>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-dim">
          {c.body}
        </p>
      </Reveal>

      <Reveal delay={260}>
        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <a
            href={t.links.email}
            className="group inline-flex w-fit items-center gap-3 bg-flame px-8 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream"
          >
            {c.cta}
            <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
              {c.bestWay}
            </p>
            <a
              href={t.links.email}
              className="mt-2 block break-all font-display text-xl text-cream underline decoration-flame decoration-2 underline-offset-8 transition-colors hover:text-flame md:text-2xl"
            >
              {t.links.email.replace("mailto:", "")}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
            {c.online}
          </span>
          {[
            { label: c.linkedin, href: t.links.linkedin },
            { label: c.github, href: t.links.github },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="group inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-flame"
            >
              {s.label}
              <Arrow className="text-flame transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          ))}
        </div>
      </Reveal>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* COMPOSITION                                                         */
/* ------------------------------------------------------------------ */

export function Sections() {
  const { t, lang } = useLang();
  return (
    <>
      <ProgressRail />
      <Hero t={t} lang={lang} />
      <Positioning t={t} lang={lang} />
      <About t={t} />
      <Build t={t} />
      <Process t={t} lang={lang} />
      <Projects t={t} lang={lang} />
      <Fit t={t} lang={lang} />
      <Contact t={t} />
    </>
  );
}
