'use client';

import React from 'react';
import { EvolutionPokemon } from '@/utils/evolutionUtils';
import { EvolutionStage } from './EvolutionStage';
import { EvolutionArrow } from './EvolutionArrow';

interface EvolutionTimelineProps {
  stages: EvolutionPokemon[][];
  onPokemonClick: (pokemonName: string, pokemonId: string) => void;
}

export function EvolutionTimeline({ stages, onPokemonClick }: EvolutionTimelineProps) {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-gray-500 dark:text-slate-400">
          No evolution data available
        </p>
      </div>
    );
  }

  // 단일 진화가 없는 포켓몬인 경우
  if (stages.length === 1) {
    return (
      <div className="text-center py-8">
        <EvolutionStage
          stage={stages[0]}
          stageIndex={0}
          onPokemonClick={onPokemonClick}
        />
        <p className="text-gray-500 dark:text-slate-400 mt-4">
          This Pokemon does not evolve
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center overflow-x-auto pb-4">
        <div className="flex items-center space-x-4 lg:space-x-8 min-w-max px-4">
          {stages.map((stage, stageIndex) => (
            <React.Fragment key={stageIndex}>
              <EvolutionStage
                stage={stage}
                stageIndex={stageIndex}
                onPokemonClick={onPokemonClick}
              />
              
              {/* 진화 화살표 (마지막 단계가 아닌 경우) */}
              {stageIndex < stages.length - 1 && (
                <EvolutionArrow
                  nextStagePokemon={stages[stageIndex + 1][0]}
                  isLastStage={stageIndex === stages.length - 1}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvolutionTimeline;
