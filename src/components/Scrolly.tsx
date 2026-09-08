"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Copy, Lang } from "@/lib/content";
import Link from "next/link";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

const SECTION_IDS = [
  "top",
  "positioning",
  "at-a-glance",
  "about",
  "what-i-build",
  "process",
  "selected-work",
  "a-good-fit",
  "investment",
  "contact",
];

const RAIL_LABELS: Record<string, { en: string; es: string }> = {
  top: { en: "Intro", es: "Portada" },
  positioning: { en: "Positioning", es: "Posicionamiento" },
  "at-a-glance": { en: "At a glance", es: "De un vistazo" },
  about: { en: "About", es: "Sobre mí" },
  "what-i-build": { en: "What I build", es: "Lo que construyo" },
  process: { en: "Process", es: "Proceso" },
  "selected-work": { en: "Selected work", es: "Trabajo seleccionado" },
  "a-good-fit": { en: "A good fit", es: "Un buen encaje" },
  investment: { en: "Investment", es: "Inversión" },
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

/* ------------------------------------------------------------------ */
/* Reveal: subtle fade + rise when a block enters the viewport        */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVis(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVis(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(18px)",
        transition: `opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll pin hook: reports 0..1 progress through a runway            */
/* ------------------------------------------------------------------ */

function usePin<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const cb = useRef<(p: number) => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      cb.current(total > 0 ? clamp01(-r.top / total) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return {
    ref,
    on: (fn: (p: number) => void) => {
      cb.current = fn;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Runway: tall scroll container with a sticky full-screen stage      */
/* ------------------------------------------------------------------ */

function Runway({
  h = "300vh",
  id,
  ref,
  children,
}: {
  h?: string;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div ref={ref} id={id} data-slide className="relative" style={{ height: h }}>
      <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Words: progressive word-by-word text highlight                     */
/* ------------------------------------------------------------------ */

function Words({
  text,
  p,
  range = [0, 1],
  color = "var(--color-flame)",
}: {
  text: string;
  p: number;
  range?: [number, number];
  color?: string;
}) {
  const [a, b] = range;
  const span = Math.max(0.0001, b - a);
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const t = words.length > 1 ? i / (words.length - 1) : 1;
        const on = clamp01((p - a) / span) >= t;
        return (
          <span key={i}>
            <span
              className="transition-colors duration-300"
              style={{ color: on ? color : "inherit" }}
            >
              {w}
            </span>{" "}
          </span>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar + chapter rail (dots, active changes with scroll)     */
/* ------------------------------------------------------------------ */

function ProgressRail() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
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
              className="flex h-8 w-8 items-center justify-center rounded-full"
            >
              <span
                aria-hidden
                className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                  isActive ? "scale-125 bg-flame" : "bg-faint/60 hover:bg-cream"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · HERO (normal flow, entrance on load)                          */
/* ------------------------------------------------------------------ */

function Hero({ t }: { t: Copy }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const enter = entered ? 1 : 0;
  const headlineParts = t.hero.headline.split(t.hero.headlineItalic);

  return (
    <section
      id="top"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="text-center"
          style={{
            opacity: enter,
            transform: `translateY(${(1 - enter) * 44}px)`,
            filter: `blur(${(1 - enter) * 10}px)`,
            transition:
              "opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Eyebrow className="text-center">{t.hero.eyebrow}</Eyebrow>
          <p className="mx-auto mt-4 max-w-4xl font-display text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-dim">
            {t.hero.preHeadline}
          </p>
          <h1 className="mx-auto mt-2 font-display text-[clamp(3rem,7.8vw,7.4rem)] leading-[1.02] tracking-[-0.02em]">
            <span className="block uppercase">{headlineParts[0]}</span>
            <em className="text-cream">
              {t.hero.headlineItalic}
            </em>
            <span className="block uppercase">{headlineParts[1]}</span>
          </h1>
        </div>

        <div
          className="mt-12 w-full"
          style={{
            opacity: enter,
            transform: `translateY(${(1 - enter) * 30}px)`,
            transition:
              "opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
          }}
        >
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
            <p className="max-w-md text-center font-serif text-xl leading-relaxed text-dim md:text-left">
              {t.hero.body}
            </p>
            <a
              href={t.links.email}
              className="group inline-flex w-fit items-center gap-3 bg-flame px-7 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream"
            >
              {t.hero.cta}
              <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <div className="marquee-fade mt-16 w-full overflow-hidden border-y border-cream/10 py-3">
            <div className="marquee-track font-sans text-[11px] uppercase tracking-[0.3em] text-faint">
              <span className="px-4">{t.hero.marquee}</span>
              <span className="px-4" aria-hidden>
                {t.hero.marquee}
              </span>
              <span className="px-4" aria-hidden>
                {t.hero.marquee}
              </span>
              <span className="px-4" aria-hidden>
                {t.hero.marquee}
              </span>
              <span className="px-4" aria-hidden>
                {t.hero.marquee}
              </span>
              <span className="px-4" aria-hidden>
                {t.hero.marquee}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · POSITIONING (normal flow, subtle reveal)                      */
/* ------------------------------------------------------------------ */

function Positioning({ t, lang }: { t: Copy; lang: Lang }) {
  const headlineParts = t.positioning.headline.split(t.positioning.headlineItalic);

  return (
    <section
      id="positioning"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 text-center md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{t.positioning.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {headlineParts[0]}
            <em className="text-flame">{t.positioning.headlineItalic}</em>
            {headlineParts[1]}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-3xl font-serif text-[clamp(1.3rem,2.3vw,1.8rem)] leading-snug text-dim">
            {t.positioning.body}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mx-auto mt-14 w-full max-w-xl border border-cream/10 bg-raised/30 text-left">
            <p className="border-b border-cream/10 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
              {t.atAGlance.eyebrow}
            </p>
            <dl>
              {t.atAGlance.items.map(([label, value], i) => (
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · ABOUT (normal flow, subtle reveal)                            */
/* ------------------------------------------------------------------ */

function About({ t }: { t: Copy }) {
  const a = t.about;

  return (
    <section
      id="about"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 text-center md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{a.eyebrow}</Eyebrow>
          <p className="mx-auto mt-10 max-w-5xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            <em className="text-cream">
              {a.quote}
            </em>
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-14 w-fit font-serif text-lg leading-relaxed text-dim">
            {a.attribution}{" "}
            <span className="text-cream">{a.role}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · WHAT I BUILD (normal flow, subtle reveal)                     */
/* ------------------------------------------------------------------ */

function WhatIBuild({ t }: { t: Copy }) {
  const b = t.whatIBuild;

  return (
    <section
      id="what-i-build"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow className="text-center">{b.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {b.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-relaxed text-dim">
            {b.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {[b.service1, b.service2].map((service, i) => (
            <Reveal key={service.label} delay={0.1 + i * 0.12} className="h-full">
              <Link href={service.link} className="flex h-full flex-col justify-between border border-cream/10 bg-raised/30 p-8 md:p-10 group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-flame">
                      {service.label}
                    </span>
                    <Arrow className="text-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight md:text-[1.7rem]">
                    {service.headline}
                  </h3>
                </div>
                <p className="mt-6 font-serif text-[15px] leading-relaxed text-dim">
                  {service.body}
                </p>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {service.secondaryBody}
                </p>
                <p className="mt-6 font-sans text-sm font-bold uppercase tracking-[0.08em] text-cream">
                  {service.price}
                </p>
                <span className="mt-6 inline-flex items-center gap-3 bg-flame px-7 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream">
                  {service.cta}
                  <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · PROCESS (pinned scrollytelling)                               */
/* ------------------------------------------------------------------ */

function PinProcess({ t, lang }: { t: Copy; lang: Lang }) {
  const { ref, on } = usePin<HTMLDivElement>();
  const [p, setP] = useState(0);
  useEffect(() => on(setP), [on]);

  const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
  const process = t.process;
  const headlineParts = process.headline.split(process.headline); // Assuming no italic in process headline

  return (
    <Runway id="process" h="300vh" ref={ref}>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-20 md:justify-center md:px-14 md:pt-0">
        <Eyebrow className="text-center">{process.eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.1rem)] leading-[1.05] tracking-[-0.015em]">
          <Words text={process.headline} p={p} range={[0.08, 0.4]} />
        </h2>

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-4 md:gap-8">
          {process.steps.map((step, i) => {
            const o = seg(0.12 + i * 0.19, 0.3 + i * 0.19);
            const border =
              o > 0.55
                ? "2px solid var(--color-flame)"
                : "2px solid rgba(246,236,216,0.15)";
            return (
              <div
                key={step.title}
                className="pt-6"
                style={{
                  borderTop: border,
                  opacity: Math.min(1, o * 1.6),
                  transform: `translateY(${(1 - o) * 30}px)`,
                  transition: "border-color 0.3s",
                }}
              >
                <h3
                  className="font-sans text-sm font-bold uppercase tracking-[0.08em]"
                  style={{ color: o > 0.55 ? "var(--color-cream)" : "var(--color-dim)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Runway>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · SELECTED WORK (pinned scrollytelling)                         */
/* ------------------------------------------------------------------ */

function PinProjects({ t }: { t: Copy }) {
  const { ref, on } = usePin<HTMLDivElement>();
  const [p, setP] = useState(0);
  useEffect(() => on(setP), [on]);

  const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
  const w = t.selectedWork;
  const headlineParts = w.headline.split(w.headlineItalic);

  return (
    <Runway id="selected-work" h="380vh" ref={ref}>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-10 md:px-14">
        <div className="text-center">
          <div style={{ opacity: seg(0, 0.12) }}>
            <Eyebrow className="text-center">{w.eyebrow}</Eyebrow>
          </div>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            <Words text={headlineParts[0]} p={p} range={[0, 0.3]} />
            <em className="text-flame">{w.headlineItalic}</em>
            <Words text={headlineParts[1]} p={p} range={[0, 0.3]} />
          </h2>
          <p
            className="mx-auto mt-6 hidden max-w-2xl font-serif text-lg leading-relaxed text-dim md:block"
            style={{ opacity: seg(0.12, 0.3) }}
          >
            {w.intro}
          </p>
        </div>

        <div className="mt-10 border-b border-cream/10">
          {w.projects.map((pr, i) => {
            const o = seg(0.1 + i * 0.16, 0.28 + i * 0.16);
            const active = o > 0.55;
            return (
              <a
                key={pr.name}
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="grid gap-3 border-t border-cream/10 py-4 md:grid-cols-12 md:items-center md:gap-6 md:py-6"
                style={{
                  opacity: Math.min(1, o * 1.5),
                  transform: `translateY(${(1 - Math.min(1, o * 1.5)) * 26}px)`,
                  background: active ? "rgba(34,25,16,0.45)" : "transparent",
                  transition: "background-color 0.3s",
                }}
              >
                <div className="md:col-span-4">
                  <h3
                    className="font-display text-2xl leading-tight transition-colors duration-300 md:text-3xl"
                    style={{ color: active ? "var(--color-cream)" : "var(--color-dim)" }}
                  >
                    {pr.name}
                  </h3>
                  <span
                    className="mt-2 inline-block border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
                    style={{
                      borderColor: active
                        ? "rgba(255,106,60,0.5)"
                        : "rgba(246,236,216,0.15)",
                      color: active ? "var(--color-flame)" : "var(--color-dim)",
                    }}
                  >
                    {pr.category}
                  </span>
                </div>
                <p className="hidden font-serif text-sm leading-snug text-dim md:col-span-5 md:block md:pr-8">
                  {pr.description}
                </p>
                <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-cream md:col-span-2 md:text-right">
                  <span className="inline-flex items-center gap-2">
                    {pr.cta}
                    <Arrow />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Runway>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · A GOOD FIT (normal flow, subtle reveal)                       */
/* ------------------------------------------------------------------ */

function Fit({ t }: { t: Copy }) {
  const f = t.aGoodFit;
  const headlineParts = f.headline.split(f.headlineItalic);

  return (
    <section
      id="a-good-fit"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow className="text-center">{f.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {headlineParts[0]}
            <em className="text-flame">{f.headlineItalic}</em>
            {headlineParts[1]}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {f.items.map((item, i) => (
            <Reveal key={item.title} delay={0.08 + i * 0.1} className="h-full">
              <div className="h-full border border-cream/10 bg-raised/25 p-7 md:p-8">
                <h3 className="font-sans text-lg font-bold uppercase leading-snug tracking-[0.02em] text-cream">
                  {item.title}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · INVESTMENT (normal flow, subtle reveal)                       */
/* ------------------------------------------------------------------ */

function Investment({ t }: { t: Copy }) {
  const inv = t.investment;
  const headlineParts = inv.headline.split(inv.headlineItalic);

  return (
    <section
      id="investment"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow className="text-center">{inv.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {headlineParts[0]}
            <em className="text-flame">{inv.headlineItalic}</em>
            {headlineParts[1]}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {[inv.service1, inv.service2].map((service, i) => (
            <Reveal key={service.title} delay={0.1 + i * 0.12} className="h-full">
              <Link href={service.link} className="flex h-full flex-col justify-between border border-cream/10 bg-raised/30 p-8 md:p-10 group">
                <div>
                  <h3 className="font-sans text-lg font-bold uppercase leading-snug tracking-[0.02em] text-cream">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm font-bold uppercase tracking-[0.08em] text-flame">
                    {service.price}
                  </p>
                </div>
                <p className="mt-6 font-serif text-[15px] leading-relaxed text-dim">
                  {service.body}
                </p>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {service.secondaryBody}
                </p>
                <span className="mt-6 inline-flex items-center gap-3 bg-flame px-7 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream">
                  {service.cta}
                  <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.24} className="text-center">
          <p className="mx-auto mt-12 max-w-2xl font-serif text-lg leading-relaxed text-dim">
            {inv.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 09 · CONTACT (normal flow, subtle reveal)                          */
/* ------------------------------------------------------------------ */

function Contact({ t }: { t: Copy }) {
  const c = t.contact;
  const headlineParts = c.headline.split(c.headlineItalic);

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 text-center md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{c.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.8vw,4.4rem)] leading-[1.03] tracking-[-0.015em]">
            {headlineParts[0]}
            <em className="text-flame">{c.headlineItalic}</em>
            {headlineParts[1]}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-dim">
            {c.body}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-center">
            <a
              href={t.links.email}
              className="group inline-flex w-fit items-center gap-3 bg-flame px-8 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-cream"
            >
              {c.cta}
              <Arrow className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
                {t.footer.bestWay}
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

        <Reveal delay={0.18}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
              {t.footer.online}
            </span>
            {[
              { label: t.footer.linkedin, href: t.links.linkedin },
              { label: t.footer.github, href: t.links.github },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="group inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-flame"
              >
                {s.label}
                <Arrow className="text-flame" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* COMPOSITION                                                         */
/* ------------------------------------------------------------------ */

export function Scrolly() {
  const { t, lang } = useLang();
  return (
    <>
      <ProgressRail />
      <Hero t={t} />
      <Positioning t={t} lang={lang} />
      <About t={t} />
      <WhatIBuild t={t} />
      <PinProcess t={t} lang={lang} />
      <PinProjects t={t} />
      <Fit t={t} />
      <Investment t={t} />
      <Contact t={t} />
    </>
  );
}
