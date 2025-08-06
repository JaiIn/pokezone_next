'use client';

import { useState, useEffect } from 'react';
import { EvolutionChain } from '@/types';
import { processEvolutionChain, EvolutionPokemon } from '@/utils/evolutionUtils';

export function useEvolutionData(evolutionChain: EvolutionChain | null) {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionPokemon[][]>([]);
  const [hasEvolution, setHasEvolution] = useState(false);

  useEffect(() => {
    if (evolutionChain) {
      try {
        console.log('Processing evolution chain:', evolutionChain);
        const stages = processEvolutionChain(evolutionChain);
        console.log('Processed evolution stages:', stages);
        setEvolutionStages(stages);
        setHasEvolution(stages.length > 1);
      } catch (error) {
        console.error('Failed to process evolution chain:', error);
        setEvolutionStages([]);
        setHasEvolution(false);
      }
    } else {
      setEvolutionStages([]);
      setHasEvolution(false);
    }
  }, [evolutionChain]);

  return {
    evolutionStages,
    hasEvolution,
  };
}

export default useEvolutionData;
