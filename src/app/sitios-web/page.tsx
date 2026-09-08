import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SitiosWebPage() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <h1>Sitios Web Page</h1>
        <p>Content for Sitios Web.</p>
      </main>
      <Footer />
    </LanguageProvider>
  );
}
