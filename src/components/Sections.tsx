"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Copy, Lang } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

/** remap progress p into the [a, b] window, clamped to 0..1 */
const lerp = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll progress of a pinned section.
 * The section is a runway (height: runwayH) with a sticky h-screen child.
 * p = 0 when the runway top reaches the viewport top (pin starts),
 * p = 1 when the pin ends and the section scrolls away.
 */
function useScrollProgress(id: string) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      setP(clamp01(-rect.top / total));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [id]);
  return p;
}

const ScrollCtx = createContext(0);
const useP = () => useContext(ScrollCtx);

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

/**
 * Progressive word highlight: each word lights up in flame as the
 * scroll progress passes its threshold, then settles into baseClass.
 */
function ScrollWords({
  text,
  p,
  start = 0.15,
  span = 0.5,
  dimStart = true,
  className = "",
  litClass = "text-flame",
  baseClass = "text-cream",
}: {
  text: string;
  p: number;
  start?: number;
  span?: number;
  dimStart?: boolean;
  className?: string;
  litClass?: string;
  baseClass?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => {
        const t = start + (i / Math.max(words.length - 1, 1)) * span;
        const lit = p >= t && p < t + 0.09;
        const done = p >= t + 0.05;
        return (
          <span
            key={i}
            className={`inline-block whitespace-pre transition-colors duration-300 ${
              dimStart ? (done ? baseClass : "text-cream/25") : baseClass
            } ${lit ? litClass : ""}`}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Background: animated grid field                                     */
/* ------------------------------------------------------------------ */

function GridField({
  variant = 0,
  parallax = 0,
}: {
  variant?: number;
  parallax?: number;
}) {
  const y = parallax * 48 - 24;
  const walkerClass = variant % 2 === 0 ? "grid-walker" : "grid-walker-alt";
  const beamClass = variant % 3 === 0 ? "grid-beam" : "grid-beam-alt";
  const wTop = 10 + (variant % 5) * 8;
  const wLeft = 6 + (variant % 4) * 14;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ transform: `translate3d(0, ${y.toFixed(1)}px, 0)` }}
    >
      <div className="grid-field absolute inset-0" />
      <div className={`${beamClass} hidden md:block`} />
      <div
        className={`${walkerClass} hidden md:block`}
        style={{ top: `${wTop}%`, left: `${wLeft}%` }}
      />
      {variant % 2 === 1 ? (
        <div
          className="grid-walker grid-walker-slow hidden md:block"
          style={{ top: "52%", left: "52%" }}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide: pinned fullscreen runway                                     */
/* ------------------------------------------------------------------ */

function Slide({
  id,
  children,
  runway = "200vh",
  variant = 0,
}: {
  id: string;
  children: React.ReactNode;
  runway?: string;
  variant?: number;
}) {
  const p = useScrollProgress(id);
  return (
    <ScrollCtx.Provider value={p}>
      <div id={id} data-slide className="relative" style={{ height: runway }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <GridField variant={variant} parallax={p} />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-14">
            {children}
          </div>
        </div>
      </div>
    </ScrollCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal (IntersectionObserver) — used where scroll-pin is not        */
/* ------------------------------------------------------------------ */

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
/* 01 · HERO                                                           */
/* ------------------------------------------------------------------ */

function Hero({ t, lang }: { t: Copy; lang: Lang }) {
  const p = useP();
  const strip = `${t.hero.strip}  ·  ${t.hero.stripSuffix}`;
  const last = lang === "en" ? "look like it." : "reflejarlo.";

  return (
    <>
      <Reveal>
        <Eyebrow className="text-center">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full bg-flame align-middle"
            aria-hidden
          />
          {t.hero.label}
        </Eyebrow>
      </Reveal>

      <h1 className="mx-auto mt-8 max-w-5xl text-center font-display text-[clamp(2.1rem,5.2vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
        <span className="block uppercase">
          <ScrollWords text={t.hero.titleA} p={p} start={0.06} span={0.3} dimStart={false} />
        </span>
        <em className="block">
          <ScrollWords text={t.hero.titleB.replace(last, "")} p={p} start={0.2} span={0.32} dimStart={false} />
          <span
            className={`transition-colors duration-500 ${
              p > 0.52 ? "text-flame" : "text-cream"
            }`}
          >
            {last}
          </span>
        </em>
      </h1>

      <Reveal delay={180}>
        <div className="mt-10 flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
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
      </Reveal>

      <div
        className="marquee-fade mt-14 w-full overflow-hidden border-y border-cream/10 py-3"
        style={{ opacity: 1 - lerp(p, 0.72, 0.92) }}
      >
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
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · POSITIONING                                                    */
/* ------------------------------------------------------------------ */

function Positioning({ t, lang }: { t: Copy; lang: Lang }) {
  const p = useP();
  const pos = t.positioning;
  const last = lang === "en" ? "catch up." : "ponerse al día.";
  const title = pos.title.replace(last, "");

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.03, 0.14) }}>
        <Eyebrow className="text-center">{pos.num}</Eyebrow>
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
        <ScrollWords text={title} p={p} start={0.16} span={0.4} />
        <em
          className={`italic transition-colors duration-500 ${
            p > 0.6 ? "text-flame" : "text-cream/25"
          }`}
        >
          {last}
        </em>
      </h2>

      <p
        className="mx-auto mt-12 max-w-3xl text-center font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug text-dim"
        style={{
          opacity: lerp(p, 0.38, 0.56),
          transform: `translateY(${(1 - lerp(p, 0.38, 0.56)) * 28}px)`,
        }}
      >
        {pos.body}
      </p>

      <div
        className="mx-auto mt-12 w-full max-w-xl border border-cream/10 bg-raised/30"
        style={{
          opacity: lerp(p, 0.52, 0.7),
          transform: `translateY(${(1 - lerp(p, 0.52, 0.7)) * 32}px)`,
        }}
      >
        <p className="border-b border-cream/10 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.25em] text-faint">
          {pos.glanceTitle}
        </p>
        <dl>
          {pos.glance.map(([label, value], i) => (
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
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · ABOUT                                                          */
/* ------------------------------------------------------------------ */

function About({ t }: { t: Copy }) {
  const p = useP();
  const a = t.about;

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.03, 0.12) }}>
        <Eyebrow className="text-center">{a.num}</Eyebrow>
      </div>

      <p className="mx-auto mt-10 max-w-5xl text-center font-display text-[clamp(2.1rem,4.8vw,4.4rem)] leading-[1.05] tracking-[-0.015em]">
        <em className="italic">
          <ScrollWords text={a.statement} p={p} start={0.15} span={0.5} />
        </em>
        <span
          className={`transition-colors duration-500 ${
            p > 0.62 ? "text-flame" : "text-cream/25"
          }`}
        >
          .
        </span>
      </p>

      <p
        className="mx-auto mt-12 w-fit font-serif text-lg leading-relaxed text-dim"
        style={{
          opacity: lerp(p, 0.55, 0.72),
          transform: `translateY(${(1 - lerp(p, 0.55, 0.72)) * 20}px)`,
        }}
      >
        <span className="text-flame">—</span>{" "}
        <span className="text-cream">{a.name}</span>{" "}
        <span className="text-faint">({a.note})</span>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · WHAT I BUILD                                                   */
/* ------------------------------------------------------------------ */

function Build({ t }: { t: Copy }) {
  const p = useP();
  const b = t.build;
  const panels = [
    { tag: b.new.tag, lead: b.new.lead, body: b.new.body },
    { tag: b.rebuild.tag, lead: b.rebuild.lead, body: b.rebuild.body },
  ];

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.03, 0.12) }}>
        <Eyebrow className="text-center">{b.num}</Eyebrow>
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
        <ScrollWords text={b.title} p={p} start={0.16} span={0.3} />
      </h2>
      <p
        className="mx-auto mt-6 max-w-2xl text-center font-serif text-lg leading-relaxed text-dim"
        style={{
          opacity: lerp(p, 0.34, 0.5),
          transform: `translateY(${(1 - lerp(p, 0.34, 0.5)) * 24}px)`,
        }}
      >
        {b.intro}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {panels.map((panel, i) => {
          const appear = lerp(p, 0.42 + i * 0.1, 0.56 + i * 0.1);
          const litStart = 0.62 + i * 0.12;
          const lit = p > litStart && p < litStart + 0.14;
          return (
            <article
              key={panel.tag}
              className="flex h-full flex-col justify-between bg-raised/30 p-8 transition-colors duration-300 md:p-10"
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 30}px)`,
                border: `1px solid ${
                  lit ? "rgba(255,106,60,0.55)" : "rgba(246,236,216,0.1)"
                }`,
              }}
            >
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
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · PROCESS                                                        */
/* ------------------------------------------------------------------ */

function Process({ t, lang }: { t: Copy; lang: Lang }) {
  const p = useP();
  const b = t.build;
  const ui = UI[lang];

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.03, 0.12) }}>
        <Eyebrow className="text-center">{b.processTitle}</Eyebrow>
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.1rem)] leading-[1.05] tracking-[-0.015em]">
        <ScrollWords text={ui.processHead} p={p} start={0.16} span={0.35} />
      </h2>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
        {b.process.map((step, i) => {
          const appear = lerp(p, 0.36 + i * 0.08, 0.5 + i * 0.08);
          const litStart = 0.56 + i * 0.1;
          const lit = p > litStart && p < litStart + 0.12;
          return (
            <div
              key={step.n}
              className="border-t-2 pt-6 transition-colors duration-300"
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 24}px)`,
                borderTopColor: lit
                  ? "rgba(255,106,60,0.9)"
                  : "rgba(246,236,216,0.15)",
              }}
            >
              <h3 className="mt-2 font-sans text-sm font-bold uppercase tracking-[0.08em] text-cream">
                {step.t}
              </h3>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                {step.d}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · SELECTED WORK                                                  */
/* ------------------------------------------------------------------ */

/** which project row is nearest the viewport centre (scroll-driven) */
function useActiveRow(count: number) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rows = Array.from(
          document.querySelectorAll<HTMLElement>("[data-project-row]")
        );
        const mid = window.innerHeight * 0.55;
        let idx = -1;
        let best = Infinity;
        rows.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < best) {
            best = d;
            idx = i;
          }
        });
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
  }, [count]);
  return active;
}

function Projects({ t, lang }: { t: Copy; lang: Lang }) {
  const w = t.work;
  const last = lang === "en" ? "Different websites." : "Sitios web diferentes.";
  const active = useActiveRow(w.projects.length);

  return (
    <section
      id="projects"
      data-slide
      className="relative flex min-h-svh items-center overflow-hidden px-6 py-24 md:px-14 md:py-28"
    >
      <GridField variant={3} />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow className="text-center">{w.num}</Eyebrow>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
            {w.title.replace(last, "")}
            <em className="text-flame">{last}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center font-serif text-lg leading-relaxed text-dim">
            {w.intro}
          </p>
        </Reveal>

        <div className="mt-12 border-b border-cream/10">
          {w.projects.map((p, i) => {
            const isActive = active === i;
            return (
              <a
                key={p.n}
                data-project-row
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`grid gap-3 border-t border-cream/10 py-6 transition-colors duration-300 md:grid-cols-12 md:items-center md:gap-6 md:py-7 ${
                  isActive ? "bg-raised/40" : ""
                }`}
              >
                <div className="md:col-span-4">
                  <h3
                    className={`font-display text-2xl leading-tight transition-colors duration-300 md:text-3xl ${
                      isActive ? "text-flame" : "text-cream"
                    }`}
                  >
                    {p.name}
                  </h3>
                  <span className="mt-2 inline-block border border-cream/15 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-dim">
                    {p.cat}
                  </span>
                </div>
                <p className="font-serif text-sm leading-snug text-dim md:col-span-5 md:pr-8">
                  {p.desc}
                </p>
                <div className="font-sans text-[11px] uppercase tracking-[0.25em] md:col-span-2 md:text-right">
                  <span
                    className={`inline-flex items-center gap-2 transition-colors duration-300 ${
                      isActive ? "text-flame" : "text-cream"
                    }`}
                  >
                    {p.link}
                    <Arrow />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · A GOOD FIT                                                     */
/* ------------------------------------------------------------------ */

function Fit({ t, lang }: { t: Copy; lang: Lang }) {
  const p = useP();
  const f = t.fit;
  const last = lang === "en" ? "real change." : "un cambio real.";
  const title = f.title.replace(last, "");

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.03, 0.12) }}>
        <Eyebrow className="text-center">{f.num}</Eyebrow>
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.015em]">
        <ScrollWords text={title} p={p} start={0.16} span={0.4} />
        <em
          className={`italic transition-colors duration-500 ${
            p > 0.6 ? "text-flame" : "text-cream/25"
          }`}
        >
          {last}
        </em>
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {f.items.map((item, i) => {
          const appear = lerp(p, 0.36 + i * 0.08, 0.5 + i * 0.08);
          const litStart = 0.58 + i * 0.1;
          const lit = p > litStart && p < litStart + 0.12;
          return (
            <article
              key={item.n}
              className="bg-raised/25 p-7 transition-colors duration-300 md:p-8"
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 26}px)`,
                border: `1px solid ${
                  lit ? "rgba(255,106,60,0.4)" : "rgba(246,236,216,0.1)"
                }`,
              }}
            >
              <h3 className="font-sans text-lg font-bold uppercase leading-snug tracking-[0.02em] text-cream">
                {item.t}
              </h3>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-dim">
                {item.d}
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · CONTACT                                                        */
/* ------------------------------------------------------------------ */

function Contact({ t }: { t: Copy }) {
  const p = useP();
  const c = t.contact;

  return (
    <>
      <div className="text-center" style={{ opacity: lerp(p, 0.05, 0.16) }}>
        <Eyebrow className="text-center">{c.num}</Eyebrow>
      </div>

      <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2.1rem,5.2vw,4.6rem)] leading-[1.03] tracking-[-0.015em]">
        <ScrollWords text={c.title.split("?")[0]} p={p} start={0.18} span={0.45} />
        <em
          className={`italic transition-colors duration-500 ${
            p > 0.62 ? "text-flame" : "text-cream/25"
          }`}
        >
          ?
        </em>
      </h2>

      <p
        className="mx-auto mt-8 max-w-2xl text-center font-serif text-lg leading-relaxed text-dim"
        style={{
          opacity: lerp(p, 0.4, 0.58),
          transform: `translateY(${(1 - lerp(p, 0.4, 0.58)) * 26}px)`,
        }}
      >
        {c.body}
      </p>

      <div
        className="mt-10 flex flex-col items-center gap-10 text-center md:flex-row md:items-end md:justify-center"
        style={{ opacity: lerp(p, 0.52, 0.7) }}
      >
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

      <div
        className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8"
        style={{ opacity: lerp(p, 0.66, 0.82) }}
      >
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
    </>
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
      <Slide id="top" runway="220vh" variant={0}>
        <Hero t={t} lang={lang} />
      </Slide>
      <Slide id="positioning" runway="200vh" variant={1}>
        <Positioning t={t} lang={lang} />
      </Slide>
      <Slide id="about" runway="200vh" variant={2}>
        <About t={t} />
      </Slide>
      <Slide id="build" runway="220vh" variant={0}>
        <Build t={t} />
      </Slide>
      <Slide id="process" runway="220vh" variant={3}>
        <Process t={t} lang={lang} />
      </Slide>
      <Projects t={t} lang={lang} />
      <Slide id="fit" runway="200vh" variant={1}>
        <Fit t={t} lang={lang} />
      </Slide>
      <Slide id="contact" runway="160vh" variant={2}>
        <Contact t={t} />
      </Slide>
    </>
  );
}
