"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { copy } from "@/lib/content";
import type { Copy, Lang } from "@/lib/content";
import { usePathname, useRouter } from "next/navigation";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Copy;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();

  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // Ensure the HTML lang attribute is set
    document.documentElement.lang = lang;

    // Client-side logic to sync localStorage with URL and handle redirects if necessary
    const saved = window.localStorage.getItem("cc-lang");
    if (saved && (saved === "en" || saved === "es") && saved !== lang) {
      // If localStorage has a different language, redirect to that language's URL
      const newPath = `/${saved}${pathname.substring(3)}`;
      router.replace(newPath);
    } else if (!saved || (saved !== "en" && saved !== "es")) {
      // If no saved language or invalid, save the current URL's language
      try {
        window.localStorage.setItem("cc-lang", lang);
      } catch {
        /* storage unavailable — ignore */
      }
    }
  }, [lang, pathname, router]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      try {
        window.localStorage.setItem("cc-lang", l);
      } catch {
        /* storage unavailable — ignore */
      }
      // Update the URL to reflect the new language
      const newPath = `/${l}${pathname.substring(3)}`;
      router.push(newPath);
    },
    [pathname, router]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t: copy[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
