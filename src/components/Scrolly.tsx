"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Copy, Lang } from "@/lib/content";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

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

function Hero({ t, lang }: { t: Copy; lang: Lang }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const enter = entered ? 1 : 0;
  const last = lang === "en" ? "look like it." : "reflejarlo.";
  const main = t.hero.titleB.replace(last, "");
  const strip = `${t.hero.strip}  ·  ${t.hero.stripSuffix}`;

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
          <Eyebrow className="text-center">{t.hero.label}</Eyebrow>
          <h1 className="mx-auto mt-8 font-display text-[clamp(2.4rem,6.2vw,5.4rem)] leading-[1.02] tracking-[-0.02em]">
            <span className="block uppercase">{t.hero.titleA}</span>
            <em className="text-cream">
              {main}
              <span className="text-flame">{last}</span>
            </em>
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

          <div className="marquee-fade mt-16 w-full overflow-hidden border-y border-cream/10 py-3">
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
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · POSITIONING (normal flow, subtle reveal)                      */
/* ------------------------------------------------------------------ */

function Positioning({ t, lang }: { t: Copy; lang: Lang }) {
  const last = lang === "en" ? "catch up." : "ponerse al día.";
  const main = t.positioning.title.replace(last, "");

  return (
    <section
      id="positioning"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 text-center md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{t.positioning.num}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {main}
            <em className="text-flame">{last}</em>
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
              {t.positioning.glanceTitle}
            </p>
            <dl>
              {t.positioning.glance.map(([label, value], i) => (
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
          <Eyebrow className="text-center">{a.num}</Eyebrow>
          <p className="mx-auto mt-10 max-w-5xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            <em className="text-cream">
              “{a.statement}”
            </em>
            <span className="text-flame">.</span>
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-14 w-fit font-serif text-lg leading-relaxed text-dim">
            <span className="text-flame">—</span>{" "}
            <span className="text-cream">{a.name}</span>{" "}
            <span className="text-faint">({a.note})</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · WHAT I BUILD (normal flow, subtle reveal)                     */
/* ------------------------------------------------------------------ */

function Build({ t }: { t: Copy }) {
  const b = t.build;
  const panels = [
    { tag: b.new.tag, lead: b.new.lead, body: b.new.body },
    { tag: b.rebuild.tag, lead: b.rebuild.lead, body: b.rebuild.body },
  ];

  return (
    <section
      id="build"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow className="text-center">{b.num}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {b.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-relaxed text-dim">
            {b.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {panels.map((panel, i) => (
            <Reveal key={panel.tag} delay={0.1 + i * 0.12} className="h-full">
              <div className="flex h-full flex-col justify-between border border-cream/10 bg-raised/30 p-8 md:p-10">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-flame">
                      {panel.tag}
                    </span>
                    <Arrow className="text-faint" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight md:text-[1.7rem]">
                    {panel.lead}
                  </h3>
                </div>
                <p className="mt-6 font-serif text-[15px] leading-relaxed text-dim">
                  {panel.body}
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
/* 05 · PROCESS (pinned scrollytelling)                               */
/* ------------------------------------------------------------------ */

function PinProcess({ t, lang }: { t: Copy; lang: Lang }) {
  const { ref, on } = usePin<HTMLDivElement>();
  const [p, setP] = useState(0);
  useEffect(() => on(setP), [on]);

  const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
  const b = t.build;
  const ui = UI[lang];
  const steps = b.process;

  return (
    <Runway id="process" h="300vh" ref={ref}>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-20 md:justify-center md:px-14 md:pt-0">
        <Eyebrow className="text-center">{b.processTitle}</Eyebrow>
        <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.1rem)] leading-[1.05] tracking-[-0.015em]">
          <Words text={ui.processHead} p={p} range={[0.08, 0.4]} />
        </h2>

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-4 md:gap-8">
          {steps.map((step, i) => {
            const o = seg(0.12 + i * 0.19, 0.3 + i * 0.19);
            const border =
              o > 0.55
                ? "2px solid var(--color-flame)"
                : "2px solid rgba(246,236,216,0.15)";
            return (
              <div
                key={step.n}
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
                  {step.t}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {step.d}
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

function PinProjects({ t, lang }: { t: Copy; lang: Lang }) {
  const { ref, on } = usePin<HTMLDivElement>();
  const [p, setP] = useState(0);
  useEffect(() => on(setP), [on]);

  const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
  const w = t.work;
  const last = lang === "en" ? "Different websites." : "Sitios web diferentes.";
  const main = w.title.replace(last, "");

  return (
    <Runway id="projects" h="380vh" ref={ref}>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-20 md:justify-center md:pt-0 md:px-14">
        <div className="text-center">
          <Eyebrow className="text-center">{w.num}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            <Words text={main} p={p} range={[0.05, 0.35]} />
            <em className="text-flame">{last}</em>
          </h2>
          <p
            className="mx-auto mt-6 hidden max-w-2xl font-serif text-lg leading-relaxed text-dim md:block"
            style={{ opacity: seg(0.2, 0.4) }}
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
                key={pr.n}
                href="#"
                onClick={(e) => e.preventDefault()}
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
                    {pr.cat}
                  </span>
                </div>
                <p className="hidden font-serif text-sm leading-snug text-dim md:col-span-5 md:block md:pr-8">
                  {pr.desc}
                </p>
                <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-cream md:col-span-2 md:text-right">
                  <span className="inline-flex items-center gap-2">
                    {pr.link}
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

function Fit({ t, lang }: { t: Copy; lang: Lang }) {
  const f = t.fit;
  const last = lang === "en" ? "real change." : "un cambio real.";
  const main = f.title.replace(last, "");

  return (
    <section
      id="fit"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow className="text-center">{f.num}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {main}
            <em className="text-flame">{last}</em>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {f.items.map((item, i) => (
            <Reveal key={item.n} delay={0.08 + i * 0.1} className="h-full">
              <div className="h-full border border-cream/10 bg-raised/25 p-7 md:p-8">
                <h3 className="font-sans text-lg font-bold uppercase leading-snug tracking-[0.02em] text-cream">
                  {item.t}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                  {item.d}
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
/* 08 · CONTACT (normal flow, subtle reveal)                          */
/* ------------------------------------------------------------------ */

function Contact({ t }: { t: Copy }) {
  const c = t.contact;
  const titleMain = c.title.split("?")[0];

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-24 text-center md:px-14"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{c.num}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,4.8vw,4.4rem)] leading-[1.03] tracking-[-0.015em]">
            {titleMain}
            <em className="text-flame">?</em>
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

        <Reveal delay={0.18}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8">
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
      <Hero t={t} lang={lang} />
      <Positioning t={t} lang={lang} />
      <About t={t} />
      <Build t={t} />
      <PinProcess t={t} lang={lang} />
      <PinProjects t={t} lang={lang} />
      <Fit t={t} lang={lang} />
      <Contact t={t} />
    </>
  );
}
