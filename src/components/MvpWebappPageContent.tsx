"use client";

import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`mx-auto max-w-6xl px-6 md:px-14 py-16 md:py-24 ${className}`}>
    {children}
  </section>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-faint mb-2">
    {children}
  </p>
);

const Headline = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl md:text-5xl tracking-tight leading-tight mb-8">
    {children}
  </h2>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-base md:text-lg text-cream/70 leading-relaxed mb-4">
    {children}
  </p>
);

const SecondaryText = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-sm text-faint mb-4">
    {children}
  </p>
);

const CtaButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center px-6 py-3 border border-flame text-flame font-sans text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-flame hover:text-ink"
  >
    {children}
  </Link>
);

const ListItem = ({ num, title, text }: { num: string; title: string; text: string }) => (
  <div className="flex items-start space-x-4 mb-6">
    <span className="font-display text-2xl text-flame">{num}</span>
    <div>
      <h3 className="font-display text-xl mb-1">{title}</h3>
      <p className="font-sans text-sm text-cream/70">{text}</p>
    </div>
  </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="mb-6">
    <h3 className="font-display text-lg mb-2">{question}</h3>
    <p className="font-sans text-sm text-cream/70">{answer}</p>
  </div>
);

export function MvpWebappPageContent() {
  const { t } = useLang();
  const s = t.mvpWebapp;

  return (
    <div className="bg-ink text-cream min-h-screen">
      <Section className="pt-32 md:pt-48 pb-16 md:pb-24">
        <Eyebrow>{s.hero.eyebrow}</Eyebrow>
        <Headline>
          {s.hero.headline.split(s.hero.headlineItalic)[0]}
          <span className="italic">{s.hero.headlineItalic}</span>
          {s.hero.headline.split(s.hero.headlineItalic)[1]}
        </Headline>
        <Body>{s.hero.body}</Body>
        <p className="font-display text-2xl text-flame mb-8">{s.hero.price}</p>
        <CtaButton href={t.links.email}>{s.hero.cta}</CtaButton>
      </Section>

      <Section>
        <Headline>{s.whatIsMvp.headline}</Headline>
        <Body>{s.whatIsMvp.body}</Body>
        <SecondaryText>{s.whatIsMvp.secondary}</SecondaryText>
        <Body>{s.whatIsMvp.final}</Body>
      </Section>

      <Section>
        <Headline>{s.whatCanInclude.headline}</Headline>
        <Body>{s.whatCanInclude.intro}</Body>
        <ul className="list-disc list-inside font-sans text-sm text-faint mb-8">
          {s.whatCanInclude.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <SecondaryText>{s.whatCanInclude.footnote}</SecondaryText>
      </Section>

      <Section>
        <Headline>{s.firstReduce.headline}</Headline>
        <Body>{s.firstReduce.body}</Body>
        <SecondaryText>{s.firstReduce.secondary}</SecondaryText>
        <Body>{s.firstReduce.final}</Body>
      </Section>

      <Section>
        <Headline>{s.howItWorks.headline}</Headline>
        <div className="grid md:grid-cols-2 gap-8">
          {s.howItWorks.items.map((item) => (
            <ListItem key={item.num} num={item.num} title={item.title} text={item.text} />
          ))}
        </div>
      </Section>

      <Section>
        <Headline>{s.goodFit.headline}</Headline>
        <div className="grid md:grid-cols-2 gap-8">
          {s.goodFit.items.map((item, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-display text-xl mb-2">{item.title}</h3>
              <Body>{item.text}</Body>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Headline>{s.scope.headline}</Headline>
        <Body>{s.scope.body}</Body>
        <SecondaryText>{s.scope.secondary}</SecondaryText>
        <Body>{s.scope.final}</Body>
      </Section>

      <Section>
        <Headline>{s.investment.headline}</Headline>
        <Body>{s.investment.body}</Body>
        <SecondaryText>{s.investment.secondary}</SecondaryText>
        <Body>{s.investment.final}</Body>
        <CtaButton href={t.links.email}>{s.investment.cta}</CtaButton>
      </Section>

      <Section>
        <Headline>{s.faq.headline}</Headline>
        <div className="grid md:grid-cols-2 gap-8">
          {s.faq.questions.map((q, i) => (
            <FaqItem key={i} question={q.question} answer={q.answer} />
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <Headline>{s.finalCta.headline}</Headline>
        <Body>{s.finalCta.body}</Body>
        <CtaButton href={t.links.email}>{s.finalCta.cta}</CtaButton>
      </Section>
    </div>
  );
}
