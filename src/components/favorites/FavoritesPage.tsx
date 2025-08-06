'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useFavorites, FavoritePokemon } from '@/hooks/useFavorites';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';

export function FavoritesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { favorites, removeFromFavorites, clearAllFavorites, mounted } = useFavorites();
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'id'>('recent');

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ThemeToggle />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-slate-400">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'id':
        return a.id - b.id;
      case 'recent':
      default:
        return b.addedAt - a.addedAt;
    }
  });

  const handlePokemonClick = (pokemon: FavoritePokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const handleRemoveFavorite = (pokemonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromFavorites(pokemonId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            ❤️ Favorite Pokemon
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            Your personal Pokemon collection
          </p>
        </div>

        {favorites.length === 0 ? (
          /* 빈 상태 */
          <div className="text-center py-16">
            <div className="text-8xl mb-8">💔</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-300 mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Start exploring Pokemon and add them to your favorites by clicking the heart icon!
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary text-lg px-8 py-3 hover:scale-105 transition-transform"
            >
              Explore Pokemon
            </button>
          </div>
        ) : (
          <>
            {/* 컨트롤 */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="text-gray-600 dark:text-slate-400">
                {favorites.length} Pokemon in your collection
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 정렬 */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="select-field"
                >
                  <option value="recent">Recently Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="id">Pokemon ID</option>
                </select>
                
                {/* 전체 삭제 */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove all favorites?')) {
                      clearAllFavorites();
                    }
                  }}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* 즐겨찾기 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {sortedFavorites.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="pokemon-card cursor-pointer overflow-hidden group relative"
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  {/* 제거 버튼 */}
                  <button
                    onClick={(e) => handleRemoveFavorite(pokemon.id, e)}
                    className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="relative p-6">
                    <div className="text-right text-gray-400 dark:text-slate-500 text-sm font-semibold mb-2">
                      #{PokemonService.formatPokemonId(pokemon.id)}
                    </div>
                    
                    <div className="flex justify-center mb-4 relative">
                      <div className="w-24 h-24 relative">
                        <Image
                          src={pokemon.imageUrl}
                          alt={pokemon.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                          sizes="96px"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pokemon.name}
                    </h3>
                    
                    <div className="flex flex-wrap justify-center gap-1">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`pokemon-type text-xs ${PokemonService.getTypeColor(type)} group-hover:scale-105 transition-transform`}
                        >
                          {PokemonService.formatTypeName(type, language)}
                        </span>
                      ))}
                    </div>

                    {/* 추가된 날짜 */}
                    <div className="text-xs text-gray-400 dark:text-slate-500 text-center mt-2">
                      Added {new Date(pokemon.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 통계 */}
            <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Collection Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Pokemon
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Set(favorites.flatMap(p => p.types)).size}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Unique Types
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round((favorites.length / 1025) * 100)}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Pokedex Complete
                  </div>
                </div>
                
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {favorites.length > 0 ? Math.ceil((Date.now() - Math.min(...favorites.map(f => f.addedAt))) / (1000 * 60 * 60 * 24)) : 0}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Days Collecting
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
