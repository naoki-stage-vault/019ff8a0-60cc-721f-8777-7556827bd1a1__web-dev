import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MvpWebappPage() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <h1>MVP Webapp Page</h1>
        <p>Content for MVP Webapp.</p>
      </main>
      <Footer />
    </LanguageProvider>
  );
}
