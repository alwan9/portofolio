import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default to 'en'
  const [lang, setLang] = useState('en');

  // Load saved language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
