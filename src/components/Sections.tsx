"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Copy } from "@/lib/content";

const Arrow = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={className}>
    ↗
  </span>
);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[11px] uppercase tracking-[0.24em] text-ink/50">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

function Hero({ t }: { t: Copy }) {
  return (
    <section id="top" className="px-5 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 bg-accent" aria-hidden />
          <SectionLabel>{t.hero.label}</SectionLabel>
        </div>

        <h1 className="mt-10 max-w-[15ch] font-display font-wide uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(2.9rem,8.2vw,7.4rem)]">
          {t.hero.titleA}
          <br />
          <span className="font-serif font-normal normal-case italic tracking-[-0.01em]">
            {t.hero.titleB.replace(/\.$/, "")}
            <span className="text-accent">.</span>
          </span>
        </h1>

        <p className="mt-10 max-w-xl font-serif text-lg leading-relaxed text-ink/80 md:text-xl">
          {t.hero.sub}
        </p>

        <a
          href={t.links.email}
          className="group mt-10 inline-flex items-center gap-3 bg-ink px-8 py-4 font-display text-[13px] uppercase tracking-[0.18em] text-paper transition-colors duration-200 hover:bg-accent"
        >
          {t.hero.cta}
          <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <div className="mt-16 flex flex-col gap-1 border-y border-ink/15 py-4 font-display text-[11px] uppercase tracking-[0.22em] text-ink/70 md:mt-20 md:flex-row md:items-center md:justify-between md:text-xs">
          <span>{t.hero.strip}</span>
          <span className="text-accent">{t.hero.stripSuffix}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* POSITIONING                                                         */
/* ------------------------------------------------------------------ */

function Positioning({ t }: { t: Copy }) {
  const pos = t.positioning;
  return (
    <section
      id="positioning"
      className="scroll-mt-32 border-t border-ink/15 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>{pos.num}</SectionLabel>

        <h2 className="mt-8 max-w-5xl font-display font-wide uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,4.6vw,3.9rem)]">
          {pos.title}
        </h2>

        <div className="mt-10 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-ink/80">
          {pos.body.map((p, i) =>
            i === pos.body.length - 1 ? (
              <p key={i} className="italic text-ink">
                {p}
              </p>
            ) : (
              <p key={i}>{p}</p>
            )
          )}
        </div>

        <div className="mt-14 border-t border-ink/15 pt-8 md:mt-20 md:pt-10">
          <SectionLabel>{pos.glanceTitle}</SectionLabel>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {pos.glance.map(([label, value]) => (
              <div
                key={label}
                className="-ml-px -mt-px border border-ink/15 p-6 md:p-8"
              >
                <dt className="font-display text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  {label}
                </dt>
                <dd className="mt-3 font-serif text-lg leading-snug md:text-xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h3 className="font-serif text-[clamp(1.5rem,3vw,2.35rem)] leading-[1.15]">
              {pos.introTitle}
            </h3>
            <p className="mt-8 font-display text-sm uppercase tracking-[0.2em] text-accent">
              — Catalina
            </p>
          </div>
          <div className="space-y-5 font-serif text-lg leading-relaxed text-ink/80 lg:col-span-6 lg:col-start-7">
            {pos.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* WHAT I BUILD                                                        */
/* ------------------------------------------------------------------ */

function BuildPanel({
  tag,
  lead,
  body,
}: {
  tag: string;
  lead: string;
  body: string[];
}) {
  return (
    <article className="group border border-ink/15 p-8 transition-colors duration-200 hover:bg-cream/50 md:p-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
              {tag}
            </h3>
            <Arrow className="text-ink/40 transition-all duration-200 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="mt-6 font-display text-xl font-semibold uppercase leading-tight tracking-[-0.01em] md:text-2xl">
            {lead}
          </p>
        </div>
        <div className="space-y-4 font-serif text-base leading-relaxed text-ink/75 lg:col-span-6 lg:col-start-7">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function Build({ t }: { t: Copy }) {
  const b = t.build;
  return (
    <section
      id="work"
      className="scroll-mt-32 border-t border-ink/15 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>{b.num}</SectionLabel>

        <h2 className="mt-8 max-w-4xl font-display font-wide uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,4.6vw,3.9rem)]">
          {b.title}
        </h2>

        <p className="mt-10 max-w-2xl font-serif text-lg leading-relaxed text-ink/80">
          {b.intro}
        </p>

        <div className="mt-12 grid gap-6 md:mt-16">
          <BuildPanel tag={b.new.tag} lead={b.new.lead} body={b.new.body} />
          <BuildPanel tag={b.rebuild.tag} lead={b.rebuild.lead} body={b.rebuild.body} />
        </div>

        <div className="mt-16 border-t border-ink/15 pt-10 md:mt-24">
          <SectionLabel>{b.processTitle}</SectionLabel>
          <ol className="mt-8 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {b.process.map((step, i) => (
              <li
                key={step.n}
                className={
                  i === 0
                    ? ""
                    : "sm:border-l sm:border-ink/15 sm:pl-8 lg:pl-10"
                }
              >
                <span className="font-display text-xs tracking-[0.2em] text-accent">
                  {step.n}
                </span>
                <h4 className="mt-3 font-display text-base font-semibold uppercase tracking-[0.12em]">
                  {step.t}
                </h4>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-ink/75">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SELECTED WORK                                                       */
/* ------------------------------------------------------------------ */

function Work({ t }: { t: Copy }) {
  const w = t.work;
  return (
    <section
      id="projects"
      className="scroll-mt-32 border-t border-ink/15 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>{w.num}</SectionLabel>

        <h2 className="mt-8 max-w-4xl font-display font-wide uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,4.6vw,3.9rem)]">
          {w.title}
        </h2>

        <p className="mt-10 max-w-3xl font-serif text-lg leading-relaxed text-ink/80">
          {w.intro}
        </p>

        <div className="mt-12 border-b border-ink/15 md:mt-16">
          {w.projects.map((p) => (
            <article
              key={p.n}
              className="grid gap-8 border-t border-ink/15 py-10 md:py-14 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-2">
                <span className="font-display text-xs tracking-[0.2em] text-ink/40">
                  {p.n}
                </span>
                <p className="mt-3 inline-block border border-ink/25 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-ink/70">
                  {p.cat}
                </p>
              </div>

              <div className="lg:col-span-4">
                <h3 className="font-display font-wide uppercase leading-none tracking-[-0.01em] text-3xl md:text-4xl">
                  {p.name}
                </h3>
                <p className="mt-5 font-serif text-base leading-relaxed text-ink/80">
                  {p.desc}
                </p>
              </div>

              <div className="lg:col-span-6">
                <p className="max-w-xl font-serif text-[15px] leading-relaxed text-ink/70">
                  {p.body}
                </p>

                <dl className="mt-7 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-display text-[10px] uppercase tracking-[0.2em] text-ink/45">
                      {p.roleLabel}
                    </dt>
                    <dd className="mt-1.5 font-serif text-[15px] leading-snug">
                      {p.role}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-display text-[10px] uppercase tracking-[0.2em] text-ink/45">
                      {p.focusLabel}
                    </dt>
                    <dd className="mt-1.5 font-serif text-[15px] leading-snug">
                      {p.focus}
                    </dd>
                  </div>
                </dl>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="group mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 font-display text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
                  aria-label={`${p.name} — ${p.link}`}
                >
                  {p.link}
                  <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* A GOOD FIT                                                          */
/* ------------------------------------------------------------------ */

function Fit({ t }: { t: Copy }) {
  const f = t.fit;
  return (
    <section
      id="fit"
      className="scroll-mt-32 border-t border-ink/15 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>{f.num}</SectionLabel>

        <h2 className="mt-8 max-w-5xl font-display font-wide uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,4.6vw,3.9rem)]">
          {f.title}
        </h2>

        <div className="mt-10 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-ink/80">
          {f.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12 border-b border-ink/15 md:mt-16">
          {f.items.map((item) => (
            <article
              key={item.n}
              className="grid gap-4 border-t border-ink/15 py-10 md:py-12 lg:grid-cols-12 lg:gap-10"
            >
              <span className="font-display text-xs tracking-[0.2em] text-ink/40 lg:col-span-1">
                {item.n}
              </span>
              <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-[-0.01em] md:text-2xl lg:col-span-5">
                {item.t}
              </h3>
              <div className="font-serif text-base leading-relaxed text-ink/75 lg:col-span-6">
                <p>{item.d}</p>
                {item.d2 ? (
                  <p className="mt-3 text-ink/60">{item.d2}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT                                                             */
/* ------------------------------------------------------------------ */

function Contact({ t }: { t: Copy }) {
  const c = t.contact;
  return (
    <section
      id="contact"
      className="scroll-mt-32 border-t border-ink/15 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>{c.num}</SectionLabel>

        <h2 className="mt-8 max-w-4xl font-display font-wide uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,4.6vw,3.9rem)]">
          {c.title}
        </h2>

        <div className="mt-10 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-ink/80">
          {c.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <a
          href={t.links.email}
          className="group mt-10 inline-flex items-center gap-3 bg-ink px-10 py-5 font-display text-[13px] uppercase tracking-[0.18em] text-paper transition-colors duration-200 hover:bg-accent"
        >
          {c.cta}
          <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <div className="mt-16 grid gap-12 border-t border-ink/15 pt-12 sm:grid-cols-2 md:mt-24">
          <div>
            <SectionLabel>{c.bestWay}</SectionLabel>
            <a
              href={t.links.email}
              className="mt-4 inline-block break-all font-serif text-2xl leading-snug underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent md:text-3xl"
            >
              {t.links.email.replace("mailto:", "")}
            </a>
          </div>
          <div>
            <SectionLabel>{c.online}</SectionLabel>
            <div className="mt-4 flex flex-col items-start gap-3">
              <a
                href={t.links.linkedin}
                className="group font-serif text-2xl md:text-3xl"
              >
                {c.linkedin}
                <Arrow className="ml-2 inline-block text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={t.links.github}
                className="group font-serif text-2xl md:text-3xl"
              >
                {c.github}
                <Arrow className="ml-2 inline-block text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* COMPOSITION                                                         */
/* ------------------------------------------------------------------ */

export function Sections() {
  const { t } = useLang();
  return (
    <>
      <Hero t={t} />
      <Positioning t={t} />
      <Build t={t} />
      <Work t={t} />
      <Fit t={t} />
      <Contact t={t} />
    </>
  );
}
