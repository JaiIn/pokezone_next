'use client';

import { useState, useEffect } from 'react';

export interface FavoritePokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 로컬 스토리지에서 즐겨찾기 로드
    const savedFavorites = localStorage.getItem('pokezone-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
        localStorage.removeItem('pokezone-favorites');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // 즐겨찾기 변경시 로컬 스토리지에 저장
      localStorage.setItem('pokezone-favorites', JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const addToFavorites = (pokemon: FavoritePokemon) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === pokemon.id);
      if (exists) return prev;
      
      return [...prev, { ...pokemon, addedAt: Date.now() }];
    });
  };

  const removeFromFavorites = (pokemonId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== pokemonId));
  };

  const toggleFavorite = (pokemon: FavoritePokemon) => {
    const isFavorite = favorites.some(fav => fav.id === pokemon.id);
    if (isFavorite) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some(fav => fav.id === pokemonId);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  // 정렬된 즐겨찾기 (최신순)
  const sortedFavorites = [...favorites].sort((a, b) => b.addedAt - a.addedAt);

  return {
    favorites: sortedFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    favoriteCount: favorites.length,
    mounted
  };
}

export default useFavorites;
