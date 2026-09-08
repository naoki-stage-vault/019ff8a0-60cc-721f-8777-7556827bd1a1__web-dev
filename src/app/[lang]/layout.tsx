import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import { copy } from "@/lib/content";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang === 'es' ? 'es' : 'en';
  const t = copy[lang];

  return {
    title: t.hero.eyebrow + " | " + t.brand,
    description: t.hero.body,
  };
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang} className={`${fraunces.variable} ${grotesk.variable}`}>
      <body>
        <LanguageProvider initialLang={lang as "en" | "es"}>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
