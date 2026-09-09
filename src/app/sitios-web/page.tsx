import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SitiosWebPageContent } from "@/components/SitiosWebPageContent";

export default function SitiosWebPage() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <SitiosWebPageContent />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
