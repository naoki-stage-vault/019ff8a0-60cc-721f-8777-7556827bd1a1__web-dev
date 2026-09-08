import { Metadata } from 'next';
import { copy } from '@/lib/content';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang === 'es' ? 'es' : 'en';
  const { mvpWebapp } = copy[lang];

  return {
    title: mvpWebapp.title,
    description: mvpWebapp.description,
  };
}

export default function MvpWebappLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
