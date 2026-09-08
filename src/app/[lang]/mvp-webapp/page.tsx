import { useLang } from '@/components/LanguageProvider';

export default function MvpWebappPage() {
  const { t } = useLang();
  const { mvpWebapp } = t;

  return (
    <main>
      {/* Hero Section */}
      <section>
        <p>{mvpWebapp.hero.eyebrow}</p>
        <h1>
          {mvpWebapp.hero.headline.split(mvpWebapp.hero.headlineItalic)[0]}
          <em>{mvpWebapp.hero.headlineItalic}</em>
          {mvpWebapp.hero.headline.split(mvpWebapp.hero.headlineItalic)[1]}
        </h1>
        <p>{mvpWebapp.hero.body}</p>
        <p>{mvpWebapp.hero.price}</p>
        <a href="#contact">{mvpWebapp.hero.cta}</a>
      </section>

      {/* What an MVP Is */}
      <section>
        <p>{mvpWebapp.whatAnMvpIs.eyebrow}</p>
        <h2>
          {mvpWebapp.whatAnMvpIs.headline.split(mvpWebapp.whatAnMvpIs.headlineItalic)[0]}
          <em>{mvpWebapp.whatAnMvpIs.headlineItalic}</em>
          {mvpWebapp.whatAnMvpIs.headline.split(mvpWebapp.whatAnMvpIs.headlineItalic)[1]}
        </h2>
        <p>{mvpWebapp.whatAnMvpIs.body}</p>
        <p>{mvpWebapp.whatAnMvpIs.secondaryBody}</p>
        <p><strong>{mvpWebapp.whatAnMvpIs.finalStatement}</strong></p>
      </section>

      {/* What It Can Include */}
      <section>
        <p>{mvpWebapp.whatItCanInclude.eyebrow}</p>
        <h2>{mvpWebapp.whatItCanInclude.headline}</h2>
        <p>{mvpWebapp.whatItCanInclude.intro}</p>
        <ul>
          {mvpWebapp.whatItCanInclude.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{mvpWebapp.whatItCanInclude.footnote}</p>
      </section>

      {/* First, We Reduce */}
      <section>
        <p>{mvpWebapp.firstWeReduce.eyebrow}</p>
        <h2>{mvpWebapp.firstWeReduce.headline}</h2>
        <p>{mvpWebapp.firstWeReduce.body}</p>
        <p>{mvpWebapp.firstWeReduce.secondaryBody}</p>
        <p><strong>{mvpWebapp.firstWeReduce.finalStatement}</strong></p>
      </section>

      {/* How It Works */}
      <section>
        <p>{mvpWebapp.howItWorks.eyebrow}</p>
        <h2>{mvpWebapp.howItWorks.headline}</h2>
        <div>
          {mvpWebapp.howItWorks.steps.map((step, index) => (
            <div key={index}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A Good Fit */}
      <section>
        <p>{mvpWebapp.aGoodFit.eyebrow}</p>
        <h2>{mvpWebapp.aGoodFit.headline}</h2>
        <div>
          {mvpWebapp.aGoodFit.items.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What MVP Does Not Mean */}
      <section>
        <p>{mvpWebapp.whatMvpDoesNotMean.eyebrow}</p>
        <h2>{mvpWebapp.whatMvpDoesNotMean.headline}</h2>
        <p>{mvpWebapp.whatMvpDoesNotMean.body}</p>
        <p>{mvpWebapp.whatMvpDoesNotMean.secondaryBody}</p>
        <p><strong>{mvpWebapp.whatMvpDoesNotMean.finalStatement}</strong></p>
      </section>

      {/* Investment */}
      <section>
        <p>{mvpWebapp.investment.eyebrow}</p>
        <h2>{mvpWebapp.investment.headline}</h2>
        <p>{mvpWebapp.investment.body}</p>
        <p>{mvpWebapp.investment.secondaryBody}</p>
        <p>{mvpWebapp.investment.finalText}</p>
        <a href="#contact">{mvpWebapp.investment.cta}</a>
      </section>

      {/* FAQ */}
      <section>
        <p>{mvpWebapp.faq.eyebrow}</p>
        <div>
          {mvpWebapp.faq.questions.map((q, index) => (
            <div key={index}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <p>{mvpWebapp.finalCta.eyebrow}</p>
        <h2>
          {mvpWebapp.finalCta.headline.split(mvpWebapp.finalCta.headlineItalic)[0]}
          <em>{mvpWebapp.finalCta.headlineItalic}</em>
          {mvpWebapp.finalCta.headline.split(mvpWebapp.finalCta.headlineItalic)[1]}
        </h2>
        <p>{mvpWebapp.finalCta.body}</p>
        <a href="#contact">{mvpWebapp.finalCta.cta}</a>
      </section>
    </main>
  );
}
