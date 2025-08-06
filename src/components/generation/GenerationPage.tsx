'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Generation } from '@/types';
import { usePokemonList } from '@/hooks/usePokemon';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/utils/translations';

interface GenerationPageProps {
  generation: Generation;
}

export function GenerationPage({ generation }: GenerationPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { 
    pokemonList, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    reset 
  } = usePokemonList(20, generation);

  const handlePokemonClick = (pokemon: any) => {
    const pokemonId = pokemon.name.includes('pokemon-') 
      ? pokemon.name.replace('pokemon-', '')
      : pokemon.name;
    
    router.push(`/pokemon/${pokemonId}`);
  };

  const generationName = language === 'en' ? generation.englishName : 
                        language === 'ja' ? generation.japaneseName : 
                        generation.koreanName;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* 세대 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {generationName}
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            Pokemon #{generation.startId} - #{generation.endId}
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {generation.endId - generation.startId + 1} Pokemon
          </div>
        </div>
        
        {error ? (
          <ErrorMessage message={error} onRetry={reset} />
        ) : (
          <>
            {/* 포켓몬 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-8">
              {pokemonList.map((pokemon, index) => (
                <PokemonCard
                  key={pokemon.name}
                  pokemon={pokemon}
                  onClick={() => handlePokemonClick(pokemon)}
                  priority={index < 10}
                />
              ))}
            </div>
            
            {loading && (
              <LoadingSpinner message={`Loading ${generationName} Pokemon...`} />
            )}
            
            {!loading && hasMore && pokemonList.length > 0 && (
              <div className="text-center mt-8 mb-8">
                <button
                  onClick={loadMore}
                  className="btn-primary hover:scale-105 transition-transform"
                >
                  {t('load_more_pokemon', language)} ({pokemonList.length}/{generation.endId - generation.startId + 1})
                </button>
              </div>
            )}
            
            {pokemonList.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Loading {generationName}...
                </h3>
                <p className="text-gray-500 dark:text-slate-400">
                  Preparing Pokemon data for this generation.
                </p>
              </div>
            )}
          </>
        )}
        
        {/* 세대 정보 */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            About {generationName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {generation.endId - generation.startId + 1}
              </div>
              <div className="text-gray-600 dark:text-slate-400">
                Total Pokemon
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                #{generation.startId}
              </div>
              <div className="text-gray-600 dark:text-slate-400">
                First Pokemon
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                #{generation.endId}
              </div>
              <div className="text-gray-600 dark:text-slate-400">
                Last Pokemon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerationPage;
