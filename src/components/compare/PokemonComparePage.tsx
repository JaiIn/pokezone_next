'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pokemon, PokemonSpecies } from '@/types';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SearchBar } from '@/components/shared/SearchBar';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePokemon } from '@/hooks/usePokemon';
import { t } from '@/utils/translations';

export function PokemonComparePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [pokemon1Id, setPokemon1Id] = useState<number | null>(null);
  const [pokemon2Id, setPokemon2Id] = useState<number | null>(null);
  
  const { pokemon: pokemon1, species: species1, loading: loading1 } = usePokemon(pokemon1Id);
  const { pokemon: pokemon2, species: species2, loading: loading2 } = usePokemon(pokemon2Id);

  const handlePokemon1Select = (pokemonId: number) => {
    setPokemon1Id(pokemonId);
  };

  const handlePokemon2Select = (pokemonId: number) => {
    setPokemon2Id(pokemonId);
  };

  const clearPokemon1 = () => {
    setPokemon1Id(null);
  };

  const clearPokemon2 = () => {
    setPokemon2Id(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('pokemon_compare', language)}
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            Compare two Pokemon side by side
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pokemon 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('first_pokemon', language)}
              </h2>
              {pokemon1 && (
                <button
                  onClick={clearPokemon1}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            
            {!pokemon1 ? (
              <div>
                <div className="mb-4">
                  <SearchBar onPokemonSelect={handlePokemon1Select} />
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500 dark:text-slate-400">
                    {t('select_first_pokemon', language)}
                  </p>
                </div>
              </div>
            ) : loading1 ? (
              <div className="text-center py-12">
                <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-slate-400">Loading...</p>
              </div>
            ) : (
              <div>
                <PokemonCard
                  pokemon={pokemon1}
                  species={species1}
                  onClick={() => router.push(`/pokemon/${pokemon1.id}`)}
                />
                
                {/* 기본 스탯 */}
                <div className="mt-6 space-y-3">
                  {pokemon1.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-gray-600 dark:text-slate-400">
                        {stat.stat.name}
                      </div>
                      <div className="w-12 text-right font-bold text-gray-800 dark:text-white">
                        {stat.base_stat}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Pokemon 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('second_pokemon', language)}
              </h2>
              {pokemon2 && (
                <button
                  onClick={clearPokemon2}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            
            {!pokemon2 ? (
              <div>
                <div className="mb-4">
                  <SearchBar onPokemonSelect={handlePokemon2Select} />
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500 dark:text-slate-400">
                    {t('select_second_pokemon', language)}
                  </p>
                </div>
              </div>
            ) : loading2 ? (
              <div className="text-center py-12">
                <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-slate-400">Loading...</p>
              </div>
            ) : (
              <div>
                <PokemonCard
                  pokemon={pokemon2}
                  species={species2}
                  onClick={() => router.push(`/pokemon/${pokemon2.id}`)}
                />
                
                {/* 기본 스탯 */}
                <div className="mt-6 space-y-3">
                  {pokemon2.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-gray-600 dark:text-slate-400">
                        {stat.stat.name}
                      </div>
                      <div className="w-12 text-right font-bold text-gray-800 dark:text-white">
                        {stat.base_stat}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 비교 결과 */}
        {pokemon1 && pokemon2 && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
              {t('basic_information', language)} Comparison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t('height', language)}
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {(pokemon1.height / 10).toFixed(1)}m
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  {pokemon1.height > pokemon2.height ? t('taller', language) : 
                   pokemon1.height < pokemon2.height ? t('shorter', language) : 
                   t('same', language)}
                </div>
              </div>
              
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {t('vs', language)}
              </div>
              
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t('height', language)}
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {(pokemon2.height / 10).toFixed(1)}m
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  {pokemon2.height > pokemon1.height ? t('taller', language) : 
                   pokemon2.height < pokemon1.height ? t('shorter', language) : 
                   t('same', language)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonComparePage;
