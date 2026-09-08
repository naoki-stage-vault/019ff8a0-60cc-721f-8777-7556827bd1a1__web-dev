import { Metadata } from 'next';
import { copy } from '@/lib/content';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang === 'es' ? 'es' : 'en';
  const { sitiosWeb } = copy[lang];

  return {
    title: sitiosWeb.title,
    description: sitiosWeb.description,
  };
}

export default function SitiosWebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
