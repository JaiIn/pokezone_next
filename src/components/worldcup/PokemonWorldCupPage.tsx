'use client';

import React, { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTournament } from '@/hooks/useTournament';
import { TOURNAMENT_SIZES } from '@/utils/tournamentUtils';
import { t } from '@/utils/translations';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function PokemonWorldCupPage() {
  const { language } = useLanguage();
  const {
    selectedSize,
    currentRound,
    currentMatch,
    participants,
    winners,
    currentPair,
    champion,
    roundName,
    loading,
    initializeTournament,
    handlePokemonSelect,
    resetTournament
  } = useTournament();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ThemeToggle />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Setting up tournament..." />
        </div>
      </div>
    );
  }

  // 토너먼트 설정 화면
  if (!selectedSize || !currentPair) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ThemeToggle />
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {t('world_cup', language)}
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              {t('choose_favorite_pokemon', language)}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
                {t('choose_tournament_size', language)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {TOURNAMENT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => initializeTournament(size.value)}
                    className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
                  >
                    <div className="text-4xl mb-2">{size.emoji}</div>
                    <div className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {size.value} {t('participants', language)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                      {size.value - 1} {t('total_matches', language)}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="text-center text-gray-500 dark:text-slate-400">
                {t('larger_tournaments', language)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 챔피언 결정 화면
  if (champion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ThemeToggle />
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
              🏆 Champion! 🏆
            </h1>
            
            <div className="max-w-md mx-auto">
              <PokemonCard
                pokemon={champion}
                onClick={() => {}}
                priority
              />
            </div>
            
            <div className="mt-8">
              <button
                onClick={resetTournament}
                className="btn-primary text-lg px-8 py-3"
              >
                Start New Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 토너먼트 진행 화면
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* 토너먼트 진행 상황 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {roundName}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Match {currentMatch + 1} of {Math.ceil(participants.length / 2)} 
            ({participants.length} {t('remaining_participants', language)})
          </p>
          
          <button
            onClick={resetTournament}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {t('change_tournament', language)}
          </button>
        </div>
        
        {/* 포켓몬 대결 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* 첫 번째 포켓몬 */}
            <div className="text-center">
              <button
                onClick={() => handlePokemonSelect(currentPair.pokemon1)}
                className="w-full transform transition-all duration-200 hover:scale-105"
              >
                <PokemonCard
                  pokemon={currentPair.pokemon1}
                  onClick={() => {}}
                  priority
                />
              </button>
            </div>
            
            {/* VS */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-400 dark:text-slate-500 mb-4">
                VS
              </div>
              <p className="text-gray-600 dark:text-slate-400">
                {t('choose_favorite_pokemon', language)}
              </p>
            </div>
            
            {/* 두 번째 포켓몬 */}
            <div className="text-center">
              <button
                onClick={() => handlePokemonSelect(currentPair.pokemon2)}
                className="w-full transform transition-all duration-200 hover:scale-105"
              >
                <PokemonCard
                  pokemon={currentPair.pokemon2}
                  onClick={() => {}}
                  priority
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* 진행률 표시 */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Tournament Progress
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-1">
                  <span>Current Round</span>
                  <span>{currentMatch + 1} / {Math.ceil(participants.length / 2)}</span>
                </div>
                <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((currentMatch + 1) / Math.ceil(participants.length / 2)) * 100}%` 
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-1">
                  <span>Overall Progress</span>
                  <span>
                    {selectedSize! - participants.length + currentMatch + 1} / {selectedSize! - 1} matches
                  </span>
                </div>
                <div className="bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((selectedSize! - participants.length + currentMatch + 1) / (selectedSize! - 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonWorldCupPage;
