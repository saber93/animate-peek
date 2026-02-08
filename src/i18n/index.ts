import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

// RTL languages
export const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

// Check if a language is RTL
export const isRTL = (lang: string) => rtlLanguages.includes(lang);

// Update document direction
export const updateDirection = (lang: string) => {
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Set initial direction
updateDirection(i18n.language);

// Update direction on language change
i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
});

export default i18n;
