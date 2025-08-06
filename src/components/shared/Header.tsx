'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from './LanguageSelector';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/utils/translations';

export function Header() {
  const pathname = usePathname();
  const { favoriteCount, mounted } = useFavorites();
  const { language } = useLanguage();
  
  const isHomePage = pathname === '/';
  
  const navItems = [
    { href: '/', label: t('pokedex', language), icon: '📚' },
    { href: '/compare', label: t('compare', language), icon: '⚔️' },
    { href: '/worldcup', label: t('world_cup', language), icon: '🏆' },
    { href: '/favorites', label: t('favorites', language), icon: '❤️', badge: mounted ? favoriteCount : 0 },
  ];
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {!isHomePage && (
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>{t('back_to_pokedex', language)}</span>
              </Link>
            )}
          </div>
          
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-4xl md:text-5xl font-bold text-center hover:scale-105 transition-transform cursor-pointer">
              PokéZone
            </h1>
          </Link>
          
          <div className="flex-1 flex justify-end">
            <LanguageSelector />
          </div>
        </div>
        
        {/* 네비게이션 메뉴 */}
        <nav className="mt-6 flex justify-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition-colors relative ${
                pathname === item.href 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
