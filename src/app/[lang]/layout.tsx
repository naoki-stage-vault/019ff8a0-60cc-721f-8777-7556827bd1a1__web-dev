import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import { copy } from "@/lib/content";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang === 'es' ? 'es' : 'en';
  const t = copy[lang];

  return {
    title: t.hero.eyebrow + " | " + t.brand,
    description: t.hero.body,
  };
}

export default function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <LanguageProvider initialLang={lang as "en" | "es"}>
      <SmoothScroll>{children}</SmoothScroll>
    </LanguageProvider>
  );
}
