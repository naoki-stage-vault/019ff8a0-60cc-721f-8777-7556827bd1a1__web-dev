import { useLang } from '@/components/LanguageProvider';

export default function SitiosWebPage() {
  const { t } = useLang();
  const { sitiosWeb } = t;

  return (
    <main>
      {/* Hero Section */}
      <section>
        <p>{sitiosWeb.hero.eyebrow}</p>
        <h1>
          {sitiosWeb.hero.headline.split(sitiosWeb.hero.headlineItalic)[0]}
          <em>{sitiosWeb.hero.headlineItalic}</em>
          {sitiosWeb.hero.headline.split(sitiosWeb.hero.headlineItalic)[1]}
        </h1>
        <p>{sitiosWeb.hero.body}</p>
        <p>{sitiosWeb.hero.price}</p>
        <a href="#contact">{sitiosWeb.hero.cta}</a>
      </section>

      {/* Two Ways to Get Here */}
      <section>
        <p>{sitiosWeb.twoWays.eyebrow}</p>
        <h2>
          {sitiosWeb.twoWays.headline.split(sitiosWeb.twoWays.headlineItalic)[0]}
          <em>{sitiosWeb.twoWays.headlineItalic}</em>
          {sitiosWeb.twoWays.headline.split(sitiosWeb.twoWays.headlineItalic)[1]}
        </h2>
        <div>
          <div>
            <h3>{sitiosWeb.twoWays.item1.title}</h3>
            <p>{sitiosWeb.twoWays.item1.text}</p>
          </div>
          <div>
            <h3>{sitiosWeb.twoWays.item2.title}</h3>
            <p>{sitiosWeb.twoWays.item2.text}</p>
            <p>{sitiosWeb.twoWays.item2.secondaryText}</p>
          </div>
        </div>
      </section>

      {/* If a Website Already Exists */}
      <section>
        <p>{sitiosWeb.ifWebsiteExists.eyebrow}</p>
        <h2>{sitiosWeb.ifWebsiteExists.headline}</h2>
        <p>{sitiosWeb.ifWebsiteExists.body}</p>
        <p>{sitiosWeb.ifWebsiteExists.secondaryBody}</p>
        <ul>
          {sitiosWeb.ifWebsiteExists.statements.map((statement, index) => (
            <li key={index}>{statement}</li>
          ))}
        </ul>
        <p><strong>{sitiosWeb.ifWebsiteExists.finalStatement}</strong></p>
      </section>

      {/* What's Included */}
      <section>
        <p>{sitiosWeb.whatsIncluded.eyebrow}</p>
        <h2>{sitiosWeb.whatsIncluded.headline}</h2>
        <div>
          {sitiosWeb.whatsIncluded.items.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <p>{sitiosWeb.howItWorks.eyebrow}</p>
        <h2>
          {sitiosWeb.howItWorks.headline.split(sitiosWeb.howItWorks.headlineItalic)[0]}
          <em>{sitiosWeb.howItWorks.headlineItalic}</em>
          {sitiosWeb.howItWorks.headline.split(sitiosWeb.howItWorks.headlineItalic)[1]}
        </h2>
        <div>
          {sitiosWeb.howItWorks.steps.map((step, index) => (
            <div key={index}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A Good Fit */}
      <section>
        <p>{sitiosWeb.aGoodFit.eyebrow}</p>
        <h2>{sitiosWeb.aGoodFit.headline}</h2>
        <div>
          {sitiosWeb.aGoodFit.items.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment */}
      <section>
        <p>{sitiosWeb.investment.eyebrow}</p>
        <h2>{sitiosWeb.investment.headline}</h2>
        <p>{sitiosWeb.investment.body}</p>
        <p>{sitiosWeb.investment.secondaryBody}</p>
        <a href="#contact">{sitiosWeb.investment.cta}</a>
      </section>

      {/* FAQ */}
      <section>
        <p>{sitiosWeb.faq.eyebrow}</p>
        <div>
          {sitiosWeb.faq.questions.map((q, index) => (
            <div key={index}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <p>{sitiosWeb.finalCta.eyebrow}</p>
        <h2>{sitiosWeb.finalCta.headline}</h2>
        <p>{sitiosWeb.finalCta.body}</p>
        <a href="#contact">{sitiosWeb.finalCta.cta}</a>
      </section>
    </main>
  );
}
