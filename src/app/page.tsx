import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Sections } from "@/components/Sections";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <Sections />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
