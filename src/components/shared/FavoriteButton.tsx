'use client';

import React from 'react';
import { Pokemon, PokemonSpecies } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites, FavoritePokemon } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  className?: string;
}

export function FavoriteButton({ pokemon, species, className = '' }: FavoriteButtonProps) {
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite, mounted } = useFavorites();

  if (!mounted) {
    return null; // SSR 방지
  }

  const isCurrentlyFavorite = isFavorite(pokemon.id);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    const favoritePokemon: FavoritePokemon = {
      id: pokemon.id,
      name: PokemonService.getDisplayName(pokemon, species, language),
      imageUrl: pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default,
      types: pokemon.types.map(type => type.type.name),
      addedAt: Date.now()
    };
    
    toggleFavorite(favoritePokemon);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-full transition-all duration-200 group
        ${isCurrentlyFavorite 
          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800' 
          : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-red-500'
        }
        ${className}
      `}
      aria-label={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className={`w-5 h-5 transition-transform duration-200 ${
          isCurrentlyFavorite ? 'scale-110' : 'group-hover:scale-110'
        }`}
        fill={isCurrentlyFavorite ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;
