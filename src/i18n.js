import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
        about: "About Us",
        contact: "Contact",
      },
    },
    hi: {
      translation: {
        welcome: "स्वागत है",
        about: "हमारे बारे में",
        contact: "संपर्क करें",
      },
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
