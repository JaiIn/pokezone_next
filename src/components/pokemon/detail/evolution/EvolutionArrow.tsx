'use client';

import React from 'react';
import { EvolutionPokemon, formatEvolutionConditions } from '@/utils/evolutionUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface EvolutionConditionBadgeProps {
  condition: string;
}

export function EvolutionConditionBadge({ condition }: EvolutionConditionBadgeProps) {
  if (!condition || condition === 'Evolution') {
    return (
      <div className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-xs font-medium">
        Evolution
      </div>
    );
  }

  return (
    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium max-w-32 text-center">
      {condition}
    </div>
  );
}

interface EvolutionArrowProps {
  nextStagePokemon: EvolutionPokemon;
  isLastStage?: boolean;
}

export function EvolutionArrow({ nextStagePokemon, isLastStage = false }: EvolutionArrowProps) {
  const { language } = useLanguage();
  
  if (isLastStage) return null;

  const condition = formatEvolutionConditions(nextStagePokemon, language);

  return (
    <div className="flex flex-col items-center mx-4 lg:mx-8">
      {/* 진화 조건 */}
      <div className="mb-4">
        <EvolutionConditionBadge condition={condition} />
      </div>

      {/* 화살표 */}
      <div className="text-3xl lg:text-4xl text-blue-500 dark:text-blue-400 animate-pulse">
        ➡️
      </div>
    </div>
  );
}

export default EvolutionArrow;
