'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pokemon, PokemonSpecies, EvolutionChain, Move } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvolutionData } from '@/hooks/useEvolutionData';
import { useMoveDetails } from '@/hooks/useMoveDetails';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EvolutionTimeline } from './detail/evolution/EvolutionTimeline';
import { MovesList } from './detail/moves/MovesList';
import { StatsRadarChart } from '@/components/shared/charts/StatsRadarChart';
import { t } from '@/utils/translations';
import { processEvolutionChain } from '@/utils/evolutionUtils';

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
  const [isShiny, setIsShiny] = useState(false);

  // 진화 데이터 처리
  const { evolutionStages, hasEvolution } = useEvolutionData(evolutionChain);
  
  // 기술 상세 정보
  const { moveDetails, loadMoveDetail } = useMoveDetails();

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

  // 포켓몬 이미지 URL
  const getImageUrl = () => {
    if (isShiny) {
      return pokemon.sprites.other['official-artwork']?.front_shiny || 
             pokemon.sprites.front_shiny || 
             pokemon.sprites.other['official-artwork']?.front_default ||
             pokemon.sprites.front_default;
    }
    return pokemon.sprites.other['official-artwork']?.front_default || 
           pokemon.sprites.front_default;
  };

  const handleEvolutionPokemonClick = (pokemonName: string, pokemonId: string) => {
    router.push(`/pokemon/${pokemonId}`);
  };

  const tabs = [
    { id: 'info', label: t('basic_info', language), icon: '📊' },
    { id: 'evolution', label: t('evolution', language), icon: '🔄', badge: hasEvolution ? evolutionStages.length : null },
    { id: 'moves', label: t('moves', language), icon: '⚔️', badge: pokemon.moves?.length || 0 },
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
              <div className="relative">
                <div className="w-48 h-48 relative">
                  <Image
                    src={getImageUrl()}
                    alt={displayName}
                    fill
                    className="object-contain transition-all duration-300"
                    priority
                    sizes="192px"
                  />
                  
                  {/* 반짝이 효과 */}
                  {isShiny && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full animate-pulse bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-full"></div>
                    </div>
                  )}
                </div>
                
                {/* 일반/이로치 토글 */}
                <button
                  onClick={() => setIsShiny(!isShiny)}
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isShiny 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isShiny ? '✨ ' + t('shiny', language) : t('normal', language)}
                </button>
              </div>
            </div>
            
            {/* 기본 정보 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-between lg:justify-start mb-4">
                <div className="text-gray-500 dark:text-slate-400 text-lg">
                  #{PokemonService.formatPokemonId(pokemon.id)}
                </div>
                
                {/* 즐겨찾기 버튼 */}
                <div className="lg:ml-4">
                  <FavoriteButton 
                    pokemon={pokemon}
                    species={species}
                    className="scale-125"
                  />
                </div>
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
              <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl mb-6">
                {flavorText}
              </p>
              
              {/* 기본 스탯 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(pokemon.height / 10).toFixed(1)}m
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {t('height', language)}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    {t('weight', language)}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {pokemon.base_experience}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
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
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-slate-600 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-8">
                {/* 종족값 */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {t('base_stats', language)}
                  </h3>
                  
                  {/* 레이더 차트 */}
                  <div className="mb-8 flex justify-center">
                    <StatsRadarChart pokemon={pokemon} />
                  </div>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => {
                      const maxStat = 255; // 포켓몬 최대 종족값
                      const percentage = (stat.base_stat / maxStat) * 100;
                      
                      return (
                        <div key={stat.stat.name} className="flex items-center">
                          <div className="w-32 text-sm font-medium text-gray-600 dark:text-slate-400">
                            {PokemonService.formatStatName(stat.stat.name, language)}
                          </div>
                          <div className="w-12 text-right font-bold text-gray-800 dark:text-white">
                            {stat.base_stat}
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  stat.base_stat >= 100 ? 'bg-green-500' :
                                  stat.base_stat >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* 총 종족값 */}
                    <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center">
                        <div className="w-32 text-sm font-bold text-gray-800 dark:text-white">
                          {t('total_stats', language)}
                        </div>
                        <div className="w-12 text-right font-bold text-blue-600 dark:text-blue-400">
                          {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 특성 */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {t('abilities', language)}
                  </h3>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <div key={ability.ability.name} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {PokemonService.formatAbilityName(ability.ability.name)}
                        </span>
                        {ability.is_hidden && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                            {t('hidden_ability', language)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
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
                ) : evolutionChain ? (
                  <EvolutionTimeline 
                    stages={evolutionStages}
                    onPokemonClick={handleEvolutionPokemonClick}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔄</div>
                    <p className="text-gray-500 dark:text-slate-400">
                      No evolution data available
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
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {t('check_all_moves', language)}
                </p>
                <MovesList 
                  pokemon={pokemon}
                  moveDetails={moveDetails}
                  onLoadDetail={loadMoveDetail}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* 네비게이션 */}
        <div className="flex justify-between items-center">
          {pokemon.id > 1 && (
            <button
              onClick={() => router.push(`/pokemon/${pokemon.id - 1}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <span>←</span>
              <span>#{(pokemon.id - 1).toString().padStart(3, '0')}</span>
            </button>
          )}
          
          <div className="flex-1"></div>
          
          {pokemon.id < 1025 && (
            <button
              onClick={() => router.push(`/pokemon/${pokemon.id + 1}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <span>#{(pokemon.id + 1).toString().padStart(3, '0')}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailPage;
