'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pokemon, PokemonSpecies, EvolutionChain } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvolutionData } from '@/hooks/useEvolutionData';
import { useMoveDetails } from '@/hooks/useMoveDetails';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EvolutionTimeline } from '@/components/pokemon/detail/evolution/EvolutionTimeline';
import { MovesList } from '@/components/pokemon/detail/moves/MovesList';
import { StatsRadarChart } from '@/components/shared/charts/StatsRadarChart';
import { Modal } from './Modal';
import { t } from '@/utils/translations';

interface PokemonModalProps {
  pokemonId: string | number | null;
  isOpen: boolean;
  onClose: () => void;
  onPokemonNavigate?: (pokemonId: string) => void;
}

export function PokemonModal({ pokemonId, isOpen, onClose, onPokemonNavigate }: PokemonModalProps) {
  const { language } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
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
    if (pokemonId && isOpen) {
      loadPokemonData();
    }
  }, [pokemonId, isOpen]);

  const loadPokemonData = async () => {
    if (!pokemonId) return;
    
    setLoading(true);
    setError(null);
    setActiveTab('info');
    setIsShiny(false);
    
    try {
      const pokemonData = await PokemonService.getPokemon(pokemonId);
      const speciesData = await PokemonService.getPokemonSpecies(pokemonData.id);
      
      setPokemon(pokemonData);
      setSpecies(speciesData);
      
      // 진화 체인 로드
      if (speciesData.evolution_chain?.url) {
        try {
          const chainData = await PokemonService.getEvolutionChain(speciesData.evolution_chain.url);
          setEvolutionChain(chainData);
        } catch (err) {
          console.warn('Failed to load evolution chain:', err);
        }
      }
      
    } catch (err) {
      setError('Failed to load Pokemon data');
      console.error('Error loading Pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvolutionPokemonClick = (pokemonName: string, pokemonId: string) => {
    if (onPokemonNavigate) {
      onPokemonNavigate(pokemonId);
    }
  };

  const handleClose = () => {
    setPokemon(null);
    setSpecies(null);
    setEvolutionChain(null);
    setError(null);
    onClose();
  };

  // 포켓몬 이미지 URL
  const getImageUrl = () => {
    if (!pokemon) return '';
    
    if (isShiny) {
      return pokemon.sprites.other['official-artwork']?.front_shiny || 
             pokemon.sprites.front_shiny || 
             pokemon.sprites.other['official-artwork']?.front_default ||
             pokemon.sprites.front_default;
    }
    return pokemon.sprites.other['official-artwork']?.front_default || 
           pokemon.sprites.front_default;
  };

  const tabs = pokemon ? [
    { id: 'info', label: t('basic_info', language), icon: '📊' },
    { id: 'evolution', label: t('evolution', language), icon: '🔄', badge: hasEvolution ? evolutionStages.length : null },
    { id: 'moves', label: t('moves', language), icon: '⚔️', badge: pokemon.moves?.length || 0 },
  ] : [];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-6">
        {loading && (
          <div className="py-12">
            <LoadingSpinner message="Loading Pokemon..." />
          </div>
        )}

        {error && (
          <div className="py-12">
            <ErrorMessage message={error} onRetry={loadPokemonData} />
          </div>
        )}

        {pokemon && species && !loading && !error && (
          <div className="space-y-6">
            {/* 포켓몬 헤더 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* 포켓몬 이미지 */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 relative">
                    <Image
                      src={getImageUrl()}
                      alt={PokemonService.getDisplayName(pokemon, species, language)}
                      fill
                      className="object-contain transition-all duration-300"
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
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  {PokemonService.getDisplayName(pokemon, species, language)}
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
                  {PokemonService.getFlavorText(species, language)}
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
            
            {/* 탭 네비게이션 */}
            <div className="border-b border-gray-200 dark:border-slate-700">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 text-center font-medium transition-colors relative ${
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
            </div>
            
            {/* 탭 콘텐츠 */}
            <div className="min-h-[500px]">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 왼쪽: 종족값 차트 */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                      {t('base_stats', language)}
                    </h3>
                    <StatsRadarChart pokemon={pokemon} />
                  </div>
                  
                  {/* 오른쪽: 상세 정보 */}
                  <div className="space-y-6">
                    {/* 종족값 상세 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                        <span className="mr-2">📊</span>
                        {t('detailed_stats', language)}
                      </h3>
                      <div className="space-y-3">
                        {pokemon.stats.map((stat, index) => {
                          const maxStat = 255;
                          const percentage = (stat.base_stat / maxStat) * 100;
                          const statColors = [
                            'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 
                            'bg-blue-500', 'bg-green-500', 'bg-purple-500'
                          ];
                          
                          return (
                            <div key={stat.stat.name} className="relative">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                  {PokemonService.formatStatName(stat.stat.name, language)}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {stat.base_stat}
                                  </span>
                                  <div className={`px-2 py-1 rounded text-xs font-medium text-white ${
                                    stat.base_stat >= 120 ? 'bg-green-500' :
                                    stat.base_stat >= 90 ? 'bg-yellow-500' :
                                    stat.base_stat >= 70 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}>
                                    {stat.base_stat >= 120 ? 'S' :
                                     stat.base_stat >= 90 ? 'A' :
                                     stat.base_stat >= 70 ? 'B' : 'C'}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-700 ${statColors[index]}`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* 총 종족값 */}
                        <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800 dark:text-white">
                              {t('total_stats', language)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                              </span>
                              <div className={`px-2 py-1 rounded text-xs font-medium text-white ${
                                pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 600 ? 'bg-purple-500' :
                                pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 500 ? 'bg-blue-500' :
                                pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 400 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}>
                                {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 600 ? 'Legendary' :
                                 pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 500 ? 'Elite' :
                                 pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0) >= 400 ? 'Strong' : 'Normal'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 특성 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                        <span className="mr-2">⚡</span>
                        {t('abilities', language)}
                      </h3>
                      <div className="space-y-3">
                        {pokemon.abilities.map((ability, index) => (
                          <div key={ability.ability.name} className="relative group">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  ability.is_hidden ? 'bg-amber-500' : 'bg-blue-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {PokemonService.formatAbilityName(ability.ability.name)}
                                </span>
                              </div>
                              {ability.is_hidden && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                                    {t('hidden_ability', language)}
                                  </span>
                                  <span className="text-amber-500">🔒</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 물리적 특성 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                        <span className="mr-2">📏</span>
                        {t('physical_characteristics', language)}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📏</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {(pokemon.height / 10).toFixed(1)}m
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              {t('height', language)}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl mb-2">⚖️</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {(pokemon.weight / 10).toFixed(1)}kg
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              {t('weight', language)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'evolution' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {t('evolution_chain', language)}
                  </h3>
                  {evolutionChain ? (
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
                  <MovesList 
                    pokemon={pokemon}
                    moveDetails={moveDetails}
                    onLoadDetail={loadMoveDetail}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default PokemonModal;
