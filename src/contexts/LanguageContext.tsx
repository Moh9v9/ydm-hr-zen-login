
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const defaultLanguage = localStorage.getItem("ydm-hr-language") as Language || "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: defaultLanguage === "ar",
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const isRTL = language === "ar";

  // Load translations based on the current language
  const translations = useTranslations(language);

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("ydm-hr-language", newLanguage);
    setLanguageState(newLanguage);
    
    // Set direction attribute on html element
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = translations;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  // Set the direction on initial load
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Use the translations from our i18n folder
const useTranslations = (language: Language) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    import(`../i18n/${language}.ts`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error(`Error loading translations for ${language}:`, error);
        setTranslations({});
      });
  }, [language]);

  return translations;
};
