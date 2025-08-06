'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';
  
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
                <span>Back to Pokedex</span>
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
          <Link 
            href="/"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Pokédex
          </Link>
          <Link 
            href="/compare"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/compare' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Compare
          </Link>
          <Link 
            href="/worldcup"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/worldcup' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            World Cup
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
