'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ko' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 로컬 스토리지에서 언어 설정 로드
    const savedLanguage = localStorage.getItem('pokezone-language') as Language;
    if (savedLanguage && ['en', 'ko', 'ja'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // 브라우저 언어 감지
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ko')) {
        setLanguageState('ko');
      } else if (browserLang.startsWith('ja')) {
        setLanguageState('ja');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    console.log('🌍 언어 변경:', language, '->', newLanguage);
    setLanguageState(newLanguage);
    
    if (mounted) {
      localStorage.setItem('pokezone-language', newLanguage);
    }
  };

  const value = {
    language,
    setLanguage,
    mounted
  };

  return (
    <LanguageContext.Provider value={value}>
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
