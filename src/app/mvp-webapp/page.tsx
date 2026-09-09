import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MvpWebappPageContent } from "@/components/MvpWebappPageContent";

export default function MvpWebappPage() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <MvpWebappPageContent />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
