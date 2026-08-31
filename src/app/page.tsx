import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Scrolly } from "@/components/Scrolly";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <Scrolly />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
