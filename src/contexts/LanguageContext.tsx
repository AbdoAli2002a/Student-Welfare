import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.activities': 'الأنشطة',
    'nav.solidarity': 'التكافل الاجتماعي',
    'nav.trips': 'الرحلات',
    'nav.elections': 'انتخابات الاتحاد',
    'nav.forum': 'المنتدى الطلابي',
    'nav.map': 'خريطة الكلية',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'خروج',
    'nav.profile': 'الملف الشخصي',
    'nav.welcome': 'مرحباً',
    'college.name': 'كلية التربية النوعية',
    'college.office': 'مكتب رعاية الطلاب',
  },
  en: {
    'nav.home': 'Home',
    'nav.activities': 'Activities',
    'nav.solidarity': 'Solidarity',
    'nav.trips': 'Trips',
    'nav.elections': 'Elections',
    'nav.forum': 'Forum',
    'nav.map': 'Campus Map',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    'nav.welcome': 'Welcome',
    'college.name': 'Faculty of Specific Education',
    'college.office': 'Student Welfare Office',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
