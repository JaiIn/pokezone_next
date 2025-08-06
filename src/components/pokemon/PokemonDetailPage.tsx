'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pokemon, PokemonSpecies, EvolutionChain } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { t } from '@/utils/translations';

interface PokemonDetailPageProps {
  initialPokemon: Pokemon;
  initialSpecies: PokemonSpecies;
  pokemonId: string;
}

export function PokemonDetailPage({ initialPokemon, initialSpecies, pokemonId }: PokemonDetailPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [pokemon] = useState<Pokemon>(initialPokemon);
  const [species] = useState<PokemonSpecies>(initialSpecies);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'evolution' | 'moves'>('info');

  useEffect(() => {
    const loadEvolutionChain = async () => {
      if (species.evolution_chain?.url) {
        setLoading(true);
        try {
          const chain = await PokemonService.getEvolutionChain(species.evolution_chain.url);
          setEvolutionChain(chain);
        } catch (err) {
          setError('Failed to load evolution chain');
        } finally {
          setLoading(false);
        }
      }
    };

    loadEvolutionChain();
  }, [species]);

  const displayName = PokemonService.getDisplayName(pokemon, species, language);
  const flavorText = PokemonService.getFlavorText(species, language);

  const tabs = [
    { id: 'info', label: t('basic_info', language), icon: '📊' },
    { id: 'evolution', label: t('evolution', language), icon: '🔄' },
    { id: 'moves', label: t('moves', language), icon: '⚔️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* 포켓몬 헤더 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* 포켓몬 이미지 */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 relative">
                <Image
                  src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={displayName}
                  fill
                  className="object-contain"
                  priority
                  sizes="192px"
                />
              </div>
            </div>
            
            {/* 기본 정보 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2">
                <span className="text-gray-500 dark:text-slate-400 text-lg">
                  #{PokemonService.formatPokemonId(pokemon.id)}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {displayName}
              </h1>
              
              {/* 타입 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type ${PokemonService.getTypeColor(type.type.name)}`}
                  >
                    {PokemonService.formatTypeName(type.type.name, language)}
                  </span>
                ))}
              </div>
              
              {/* 설명 */}
              <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl">
                {flavorText}
              </p>
              
              {/* 기본 스탯 */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {(pokemon.height / 10).toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {t('height', language)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {t('weight', language)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {pokemon.base_experience}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    Base XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {t('base_stats', language)}
                </h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-32 text-sm font-medium text-gray-600 dark:text-slate-400">
                        {PokemonService.formatStatName(stat.stat.name, language)}
                      </div>
                      <div className="w-12 text-right font-bold text-gray-800 dark:text-white">
                        {stat.base_stat}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-8 text-gray-800 dark:text-white">
                  {t('abilities', language)}
                </h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability) => (
                    <div key={ability.ability.name} className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm font-medium">
                        {PokemonService.formatAbilityName(ability.ability.name)}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {t('hidden_ability', language)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'evolution' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {t('evolution_chain', language)}
                </h3>
                {loading ? (
                  <LoadingSpinner message="Loading evolution data..." />
                ) : error ? (
                  <ErrorMessage message={error} />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔄</div>
                    <p className="text-gray-500 dark:text-slate-400">
                      Evolution chain feature coming soon...
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'moves' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {t('learnable_moves', language)}
                </h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⚔️</div>
                  <p className="text-gray-500 dark:text-slate-400">
                    Moves list feature coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailPage;
