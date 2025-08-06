'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EvolutionPokemon, getStageLabel } from '@/utils/evolutionUtils';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';

interface EvolutionPokemonCardProps {
  pokemon: EvolutionPokemon;
  stageIndex: number;
  onPokemonClick: (pokemonName: string, pokemonId: string) => void;
}

export const EvolutionPokemonCard = React.memo(({ 
  pokemon, 
  stageIndex, 
  onPokemonClick 
}: EvolutionPokemonCardProps) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [displayName, setDisplayName] = useState(pokemon.name);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPokemonName = async () => {
      try {
        const species = await PokemonService.getPokemonSpecies(parseInt(pokemon.id));
        const localizedName = PokemonService.getDisplayName(
          { id: parseInt(pokemon.id), name: pokemon.name } as any,
          species,
          language
        );
        setDisplayName(localizedName);
      } catch (error) {
        setDisplayName(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1));
      } finally {
        setLoading(false);
      }
    };

    loadPokemonName();
  }, [pokemon.id, pokemon.name, language]);
  
  const handleClick = () => {
    onPokemonClick(pokemon.name, pokemon.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
      style={{ width: '180px' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Evolution stage ${stageIndex + 1}: ${pokemon.name}`}
    >
      <div className="text-center">
        {/* 포켓몬 이미지 */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-full group-hover:animate-pulse"></div>
          <div className="relative z-10 w-full h-full p-2">
            <Image
              src={imageError ? fallbackUrl : imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="80px"
              onError={() => setImageError(true)}
            />
          </div>
        </div>

        {/* 포켓몬 정보 */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
            #{pokemon.id.padStart(3, '0')}
          </div>
          <div className="font-bold text-sm text-gray-900 dark:text-slate-100">
            {loading ? 'Loading...' : displayName}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">
            {getStageLabel(stageIndex, language)}
          </div>
        </div>
      </div>
    </div>
  );
});

EvolutionPokemonCard.displayName = 'EvolutionPokemonCard';

export default EvolutionPokemonCard;
