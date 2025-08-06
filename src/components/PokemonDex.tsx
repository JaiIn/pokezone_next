'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePokemonList } from '@/hooks/usePokemon';
import { Pokemon } from '@/types';
import { Header } from './shared/Header';
import { ThemeToggle } from './shared/ThemeToggle';
import { SearchBar } from './shared/SearchBar';
import { PokemonCard } from './shared/PokemonCard';
import { AdvancedFilters } from './shared/filters/AdvancedFilters';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/utils/translations';
import { GENERATIONS } from '@/types';

const GenerationSelector = ({ selectedGeneration, onGenerationChange }: any) => {
  const { language } = useLanguage();
  
  return (
    <div className="mb-6">
      <div className="max-w-sm mx-auto">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {t('generation_select', language)}
        </label>
        <select
          value={selectedGeneration.id}
          onChange={(e) => {
            const newGen = GENERATIONS.find(gen => gen.id === parseInt(e.target.value));
            if (newGen) onGenerationChange(newGen);
          }}
          className="select-field"
        >
          {GENERATIONS.map(gen => (
            <option key={gen.id} value={gen.id}>
              {language === 'en' ? gen.englishName : 
               language === 'ja' ? gen.japaneseName : 
               gen.koreanName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const PokemonGrid = ({ pokemonList, onPokemonClick }: any) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-8">
      {pokemonList.map((pokemon: any, index: number) => (
        <PokemonCard
          key={pokemon.name}
          pokemon={pokemon}
          onClick={() => onPokemonClick(pokemon)}
          priority={index < 10} // 처음 10개는 우선 로딩
          showFavorite={true} // 즐겨찾기 버튼 표시
        />
      ))}
    </div>
  );
};

export function PokemonDex() {
  const router = useRouter();
  const { language } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  
  const { 
    pokemonList, 
    loading, 
    error, 
    hasMore, 
    currentGeneration,
    loadMore, 
    changeGeneration,
    reset 
  } = usePokemonList(20);
  
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    // Pokemon ID 추출 (pokemon-1 -> 1)
    const pokemonId = pokemon.name.includes('pokemon-') 
      ? pokemon.name.replace('pokemon-', '')
      : pokemon.name;
    
    router.push(`/pokemon/${pokemonId}`);
  };

  const handleSearchSelect = (pokemonId: number) => {
    router.push(`/pokemon/${pokemonId}`);
  };

  const handleCompareClick = () => {
    router.push('/compare');
  };

  const handleWorldCupClick = () => {
    router.push('/worldcup');
  };

  const handleFiltersChange = (filters: any) => {
    setAppliedFilters(filters);
    // TODO: 필터 로직 구현 (다음 단계에서)
  };

  // 필터링된 포켓몬 리스트 (기본 구현)
  const filteredPokemonList = pokemonList; // TODO: 실제 필터링 로직 구현

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <SearchBar onPokemonSelect={handleSearchSelect} />
        
        {/* 고급 필터 */}
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <GenerationSelector 
            selectedGeneration={currentGeneration}
            onGenerationChange={changeGeneration}
          />
          
          <div className="flex space-x-3">
            <button
              onClick={handleCompareClick}
              className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <span>⚔️</span>
              <span>{t('pokemon_compare', language)}</span>
            </button>
            <button
              onClick={handleWorldCupClick}
              className="btn-secondary flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <span>🏆</span>
              <span>{t('world_cup', language)}</span>
            </button>
          </div>
        </div>
        
        {error ? (
          <ErrorMessage message={error} onRetry={reset} />
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-300">
                {language === 'en' ? currentGeneration.englishName : 
                 language === 'ja' ? currentGeneration.japaneseName : 
                 currentGeneration.koreanName}
              </h2>
              {currentGeneration.id !== 0 && (
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                  #{currentGeneration.startId} - #{currentGeneration.endId}
                </p>
              )}
            </div>
            
            <PokemonGrid 
              pokemonList={filteredPokemonList} 
              onPokemonClick={handlePokemonClick}
            />
            
            {loading && (
              <LoadingSpinner message="Loading Pokemon..." />
            )}
            
            {!loading && hasMore && pokemonList.length > 0 && (
              <div className="text-center mt-8 mb-8">
                <button
                  onClick={loadMore}
                  className="btn-primary hover:scale-105 transition-transform"
                >
                  {t('load_more_pokemon', language)} ({pokemonList.length}/{currentGeneration.id === 0 ? 1025 : currentGeneration.endId - currentGeneration.startId + 1})
                </button>
              </div>
            )}
            
            {pokemonList.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Getting Ready...
                </h3>
                <p className="text-gray-500 dark:text-slate-400">
                  Your Pokemon adventure is about to begin!
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 즐겨찾기 플로팅 버튼 (모바일) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={() => router.push('/favorites')}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <footer className="bg-gray-800 dark:bg-slate-900 text-white py-8 mt-16 border-t border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 dark:text-slate-400">
            Data provided by: <a href="https://pokeapi.co/" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">PokeAPI</a>
          </p>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">
            Built with Next.js 14 and powered by PokeAPI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PokemonDex;
