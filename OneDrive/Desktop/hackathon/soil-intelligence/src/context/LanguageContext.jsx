import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

const translations = {
  en: {
    brand: "Soil Intelligence",
    slogan: "AI-Powered AgriTech",
    nav: {
      dashboard: "Dashboard",
      sensors: "Sensors",
      analysis: "New Analysis",
      history: "History",
      smarttools: "Smart Tools",
      yield: "Yield",
      disease: "Disease",
      chat: "Expert Chat",
      weather: "Weather",
      about: "About",
    },
    navSections: {
      core: "Core Features",
      ai: "AI / ML Suite",
    },
    auth: {
      welcome: "Secure Login",
      subtitle: "Sign in to access your AI agronomy cockpit",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      login: "Login",
      signup: "Create Account",
      google: "Continue with Gmail",
      otp: "Send OTP",
    },
    dashboard: {
      title: "Live Soil Health Dashboard",
      subtitle:
        "Track nutrients, IoT sensors, AI recommendations, and yield forecasts tuned to Indian standards.",
      health: "Soil Health Score",
      tests: "Total Tests",
      sensors: "Active Sensors",
      locations: "Field Locations",
      smartInsightsTitle: "Smart Insights Dashboard",
      smartInsightsDesc:
        "Lightweight ML produces instant charts, predictions, and Grad-CAM style explanations.",
      xaiTitle: "Explainability Snapshot",
      featureTitle: "Feature Contributions",
    },
    sensors: {
      title: "Live IoT Sensor Monitor",
      subtitle:
        "Streaming from Microbial Sensor + 8-in-1 sensor array for real-time agronomy decisions.",
      button: "Simulate Sensor Reading",
      devices: "Sensors in use: Microbial sensor & 8-in-1 climate sensor",
    },
    weather: {
      title: "Weather Intelligence",
      subtitle:
        "Real-world forecast fused with soil insights for precise irrigation and nutrient timing.",
    },
    about: {
      title: "About the Creators",
      subtitle:
        "Passionate agripreneurs building AI-driven soil intelligence for farmers.",
    },
  },
  hi: {
    brand: "मिट्टी बुद्धिमत्ता",
    slogan: "एआई संचालित कृषि तकनीक",
    nav: {
      dashboard: "डैशबोर्ड",
      sensors: "सेंसर",
      analysis: "नई विश्लेषण",
      history: "इतिहास",
      smarttools: "स्मार्ट टूल्स",
      yield: "उत्पादन",
      disease: "रोग",
      chat: "विशेषज्ञ चैट",
      weather: "मौसम",
      about: "हमारे बारे में",
    },
    navSections: {
      core: "मुख्य सुविधाएँ",
      ai: "एआई / एमएल सूट",
    },
    auth: {
      welcome: "सुरक्षित लॉगिन",
      subtitle: "अपने एआई कृषि डैशबोर्ड तक पहुंचने के लिए साइन इन करें",
      name: "पूरा नाम",
      email: "ईमेल",
      phone: "फोन नंबर",
      password: "पासवर्ड",
      login: "लॉगिन",
      signup: "खाता बनाएं",
      google: "जीमेल से जारी रखें",
      otp: "ओटीपी भेजें",
    },
    dashboard: {
      title: "लाइव मिट्टी स्वास्थ्य डैशबोर्ड",
      subtitle:
        "भारतीय मानकों के अनुसार पोषक तत्व, सेंसर, एआई अनुशंसाएँ और उत्पादन पूर्वानुमान ट्रैक करें।",
      health: "मिट्टी स्वास्थ्य स्कोर",
      tests: "कुल परीक्षण",
      sensors: "सक्रिय सेंसर",
      locations: "कृषि क्षेत्र",
      smartInsightsTitle: "स्मार्ट अंतर्दृष्टि डैशबोर्ड",
      smartInsightsDesc:
        "हल्के एमएल त्वरित चार्ट, भविष्यवाणियाँ और व्याख्याएं प्रदान करते हैं।",
      xaiTitle: "समझाने योग्य एआई",
      featureTitle: "मुख्य योगदान",
    },
    sensors: {
      title: "लाइव IoT सेंसर मॉनिटर",
      subtitle:
        "सूक्ष्मजीव सेंसर और 8-इन-1 सेंसर सेट से वास्तविक समय डेटा।",
      button: "सेंसर रीडिंग सिम्युलेट करें",
      devices: "उपयोग में सेंसर: माइक्रोबियल + 8-इन-1 जलवायु सेंसर",
    },
    weather: {
      title: "मौसम बुद्धिमत्ता",
      subtitle:
        "वास्तविक पूर्वानुमान + मिट्टी अंतर्दृष्टि से सिंचाई और उर्वरक समय तय करें।",
    },
    about: {
      title: "निर्माताओं के बारे में",
      subtitle:
        "किसानों के लिए एआई आधारित मिट्टी समाधान बनाने वाली उत्साही टीम।",
    },
  },
  kn: {
    brand: "ಮಣ್ಣಿನ ಬುದ್ಧಿವಂತಿಕೆ",
    slogan: "ಎಐ ಚಾಲಿತ ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ",
    nav: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      sensors: "ಸೆನ್ಸರ್‌ಗಳು",
      analysis: "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
      history: "ಇತಿಹಾಸ",
      smarttools: "ಸ್ಮಾರ್ಟ್ ಸಾಧನಗಳು",
      yield: "ಉತ್ಪಾದನೆ",
      disease: "ರೋಗ",
      chat: "ತಜ್ಞರ ಚಾಟ್",
      weather: "ಹವಾಮಾನ",
      about: "ನಮ್ಮ ಬಗ್ಗೆ",
    },
    navSections: {
      core: "ಮೂಲ ವೈಶಿಷ್ಟ್ಯಗಳು",
      ai: "ಎಐ / ಎಂಎಲ್ ಸಾಧನಗಳು",
    },
    auth: {
      welcome: "ಭದ್ರ ಲಾಗಿನ್",
      subtitle: "ನಿಮ್ಮ ಎಐ ಕೃಷಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
      name: "ಪೂರ್ಣ ಹೆಸರು",
      email: "ಇಮೇಲ್",
      phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
      password: "ಪಾಸ್‌ವರ್ಡ್",
      login: "ಲಾಗಿನ್",
      signup: "ಖಾತೆ ಸೃಷ್ಟಿಸಿ",
      google: "ಜಿಮೇಲ್ ಮೂಲಕ ಮುಂದುವರಿಸಿ",
      otp: "OTP ಕಳುಹಿಸಿ",
    },
    dashboard: {
      title: "ಲೈವ್ ಮಣ್ಣು ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      subtitle:
        "ಪೋಷಕಾಂಶ, ಸೆನ್ಸರ್, ಎಐ ಸಲಹೆ ಮತ್ತು ಉತ್ಪಾದನಾ ಪೂರ್ವಾನ್ಮಾನಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      health: "ಮಣ್ಣು ಆರೋಗ್ಯ ಅಂಕ",
      tests: "ಒಟ್ಟು ಪರೀಕ್ಷೆಗಳು",
      sensors: "ಸಕ್ರಿಯ ಸೆನ್ಸರ್‌ಗಳು",
      locations: "ಕ್ಷೇತ್ರಗಳು",
      smartInsightsTitle: "ಸ್ಮಾರ್ಟ್ ಒಳನೋಟಗಳು",
      smartInsightsDesc:
        "ಲಘು ಎಂಎಲ್ ಮಾದರಿಗಳು ಕ್ಷಿಪ್ರ ಗ್ರಾಫ್‌ಗಳು ಮತ್ತು ವಿವರಗಳನ್ನು ಒದಗಿಸುತ್ತವೆ.",
      xaiTitle: "ವಿವರಣಾತ್ಮಕ ಎಐ",
      featureTitle: "ಮುಖ್ಯ ಪಾತ್ರಗಳು",
    },
    sensors: {
      title: "ಲೈವ್ IoT ಸೆನ್ಸರ್ ಮಾನಿಟರ್",
      subtitle:
        "ಮೈಕ್ರೋಬಿಯಲ್ ಮತ್ತು 8-ಇನ್-1 ಸೆನ್ಸರ್‌ಗಳಿಂದ ರಿಯಲ್-ಟೈಮ್ ಡೇಟಾ.",
      button: "ಸೆನ್ಸರ್ ಓದುವಿಕೆಯನ್ನು ಅನುಕರಿಸಿ",
      devices: "ಬಳಕೆಯಲ್ಲಿರುವ ಸೆನ್ಸರ್‌ಗಳು: ಮೈಕ್ರೋಬಿಯಲ್ + 8-ಇನ್-1 ಹವಾಮಾನ ಸೆನ್ಸರ್",
    },
    weather: {
      title: "ಹವಾಮಾನ ಬುದ್ಧಿವಂತಿಕೆ",
      subtitle:
        "ವಾಸ್ತವಿಕ ಪೂರ್ವಾನ್ಮಾನ + ಮಣ್ಣಿನ ಒಳನೋಟಗಳಿಂದ ನೀರಾವರಿ, ಪೋಷಕ ಯೋಜನೆ.",
    },
    about: {
      title: "ಸೃಷ್ಟಿಕರ್ತರ ಬಗ್ಗೆ",
      subtitle:
        "ಕೃಷಕರಿಗಾಗಿ ಎಐ ಚಾಲಿತ ಮಣ್ಣು ಪರಿಹಾರ ರಚಿಸುವ ತಂಡ.",
    },
  },
};

const getTranslation = (lang, key) => {
  const parts = key.split(".");
  return parts.reduce(
    (acc, current) => (acc && acc[current] !== undefined ? acc[current] : undefined),
    lang
  );
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key) => {
        const entry =
          getTranslation(translations[lang], key) ??
          getTranslation(translations.en, key);
        return entry ?? key;
      },
      translations,
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

