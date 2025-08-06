'use client';

import React from 'react';
import Image from 'next/image';
import { PokemonType } from '@/types';
import { useSearch } from '@/hooks/usePokemon';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/utils/translations';

interface SearchBarProps {
  onPokemonSelect: (pokemonId: number) => void;
}

export function SearchBar({ onPokemonSelect }: SearchBarProps) {
  const { language } = useLanguage();
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResult, 
    searchSpecies,
    searchLoading, 
    searchError, 
    clearSearch 
  } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResult) {
      onPokemonSelect(searchResult.id);
      clearSearch();
    }
  };

  const displayName = searchResult ? PokemonService.getDisplayName(searchResult, searchSpecies, language) : '';

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('enter_pokemon_name', language)}
          className="input-field pr-12"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
        {/* 검색 아이콘 */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      {searchLoading && (
        <div className="mt-2 text-center text-muted flex items-center justify-center space-x-2">
          <div className="loading-spinner w-4 h-4"></div>
          <span>{t('loading', language)}</span>
        </div>
      )}

      {searchError && (
        <div className="mt-2 text-center text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          {searchError}
        </div>
      )}

      {searchResult && (
        <div className="mt-2 card p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={searchResult.sprites.front_default}
                alt={displayName}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
                #{searchResult.id.toString().padStart(3, '0')} {displayName}
              </h3>
              <div className="flex space-x-2 mt-1 flex-wrap">
                {searchResult.types.map((type: PokemonType) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                  >
                    {PokemonService.formatTypeName(type.type.name, language)}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                onPokemonSelect(searchResult.id);
                clearSearch();
              }}
              className="btn-primary flex-shrink-0 hover:scale-105 transition-transform"
            >
              {t('select', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
