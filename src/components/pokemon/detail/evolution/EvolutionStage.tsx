'use client';

import React from 'react';
import { EvolutionPokemon } from '@/utils/evolutionUtils';
import { EvolutionPokemonCard } from './EvolutionPokemonCard';

interface EvolutionStageProps {
  stage: EvolutionPokemon[];
  stageIndex: number;
  onPokemonClick: (pokemonName: string, pokemonId: string) => void;
}

export function EvolutionStage({ stage, stageIndex, onPokemonClick }: EvolutionStageProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {stage.map((pokemon, pokemonIndex) => (
        <EvolutionPokemonCard
          key={`${pokemon.id}-${pokemonIndex}`}
          pokemon={pokemon}
          stageIndex={stageIndex}
          onPokemonClick={onPokemonClick}
        />
      ))}
    </div>
  );
}

export default EvolutionStage;
