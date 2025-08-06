'use client';

import { useState, useCallback } from 'react';
import { Move } from '@/types';
import { PokemonService } from '@/services/pokemonService';

export function useMoveDetails() {
  const [moveDetails, setMoveDetails] = useState<{ [key: string]: Move }>({});
  const [loadingMoves, setLoadingMoves] = useState<string[]>([]);

  const loadMoveDetail = useCallback(async (moveName: string) => {
    if (moveDetails[moveName] || loadingMoves.includes(moveName)) {
      return; // 이미 로드되었거나 로딩 중
    }

    setLoadingMoves(prev => [...prev, moveName]);
    
    try {
      const move = await PokemonService.getMove(moveName);
      setMoveDetails(prev => ({
        ...prev,
        [moveName]: move
      }));
    } catch (error) {
      console.error(`Failed to load move ${moveName}:`, error);
    } finally {
      setLoadingMoves(prev => prev.filter(name => name !== moveName));
    }
  }, [moveDetails, loadingMoves]);

  const isLoadingMove = useCallback((moveName: string) => {
    return loadingMoves.includes(moveName);
  }, [loadingMoves]);

  return {
    moveDetails,
    loadMoveDetail,
    isLoadingMove,
  };
}

export default useMoveDetails;
