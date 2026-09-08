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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const getLangFromPath = useCallback(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && (pathParts[0] === 'en' || pathParts[0] === 'es')) {
      return pathParts[0] as Lang;
    }
    return "en"; // Default to English if no language in path
  }, [pathname]);

  const [lang, setLangState] = useState<Lang>(getLangFromPath());

  useEffect(() => {
    // This effect runs only on the client side after hydration
    const saved = window.localStorage.getItem("cc-lang");
    const initialLang = getLangFromPath();

    if (saved && (saved === "en" || saved === "es")) {
      if (saved !== initialLang) {
        // If saved language in localStorage is different from URL, update URL
        const newPath = `/${saved}${pathname.substring(3)}`; // e.g., /en/path -> /es/path
        router.replace(newPath);
        setLangState(saved);
      } else {
        setLangState(saved);
      }
    } else {
      // If no saved language, or invalid, use language from path and save it
      setLangState(initialLang);
      try {
        window.localStorage.setItem("cc-lang", initialLang);
      } catch {
        /* storage unavailable — ignore */
      }
    }
  }, [getLangFromPath, pathname, router]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      try {
        window.localStorage.setItem("cc-lang", l);
      } catch {
        /* storage unavailable — ignore */
      }
      // Update the URL to reflect the new language
      const newPath = `/${l}${pathname.substring(3)}`; // e.g., /en/path -> /es/path
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
