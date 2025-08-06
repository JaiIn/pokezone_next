'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pokemon, PokemonSpecies, PokemonListItem } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';

interface PokemonCardProps {
  pokemon: Pokemon | PokemonListItem | any;
  species?: PokemonSpecies | null;
  onClick: () => void;
  priority?: boolean;
}

export function PokemonCard({ pokemon, species, onClick, priority = false }: PokemonCardProps) {
  const { language } = useLanguage();
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pokemon 객체가 완전하지 않은 경우 (PokemonListItem인 경우)
    if (!pokemon.types && pokemon.name) {
      const loadPokemonData = async () => {
        setLoading(true);
        try {
          let pokemonId = pokemon.name;
          if (pokemon.name.includes('pokemon-')) {
            pokemonId = pokemon.name.replace('pokemon-', '');
          }
          const data = await PokemonService.getPokemon(pokemonId);
          setPokemonData(data);
        } catch (error) {
          console.error('Failed to load pokemon data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadPokemonData();
    } else {
      setPokemonData(pokemon);
    }
  }, [pokemon]);

  if (loading) {
    return (
      <div className="pokemon-card cursor-pointer overflow-hidden group">
        <div className="relative p-6">
          <div className="text-right text-gray-400 dark:text-slate-500 text-sm font-semibold mb-2">
            #{pokemon.name.includes('pokemon-') ? pokemon.name.replace('pokemon-', '').padStart(3, '0') : '???'}
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <div className="loading-spinner w-8 h-8"></div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Loading...
          </h3>
        </div>
      </div>
    );
  }

  if (!pokemonData) {
    return (
      <div className="pokemon-card cursor-pointer overflow-hidden group" onClick={onClick}>
        <div className="relative p-6">
          <div className="text-right text-gray-400 dark:text-slate-500 text-sm font-semibold mb-2">
            #{pokemon.name.includes('pokemon-') ? pokemon.name.replace('pokemon-', '').padStart(3, '0') : '???'}
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white capitalize">
            {pokemon.name.replace('pokemon-', '#').replace('-', ' ')}
          </h3>
        </div>
      </div>
    );
  }

  const displayName = species ? PokemonService.getDisplayName(pokemonData, species, language) : 
                     pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
  const imageUrl = pokemonData.sprites?.other?.['official-artwork']?.front_default || 
                   pokemonData.sprites?.front_default;

  return (
    <div
      className="pokemon-card cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative p-6">
        <div className="text-right text-gray-400 dark:text-slate-500 text-sm font-semibold mb-2">
          #{PokemonService.formatPokemonId(pokemonData.id)}
        </div>
        
        <div className="flex justify-center mb-4 relative">
          <div className="w-24 h-24 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={displayName}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 96px, 96px"
                priority={priority}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (pokemonData.sprites?.front_default) {
                    target.src = pokemonData.sprites.front_default;
                  }
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {displayName}
        </h3>
        
        {pokemonData.types && (
          <div className="flex flex-wrap justify-center gap-2">
            {pokemonData.types.map((type: any) => (
              <span
                key={type.type.name}
                className={`pokemon-type ${PokemonService.getTypeColor(type.type.name)} group-hover:scale-105 transition-transform`}
              >
                {PokemonService.formatTypeName(type.type.name, language)}
              </span>
            ))}
          </div>
        )}
        
        {/* 호버 효과용 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 rounded-lg" />
      </div>
    </div>
  );
}

export default PokemonCard;
