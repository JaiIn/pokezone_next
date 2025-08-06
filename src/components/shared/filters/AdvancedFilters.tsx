'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GENERATIONS } from '@/types';
import { t } from '@/utils/translations';

interface FilterOptions {
  generation: number;
  types: string[];
  minStats: number;
  maxStats: number;
  hasEvolution: 'all' | 'yes' | 'no';
  searchTerm: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const POKEMON_TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

export function AdvancedFilters({ onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const { language } = useLanguage();
  const [filters, setFilters] = useState<FilterOptions>({
    generation: 0,
    types: [],
    minStats: 0,
    maxStats: 800,
    hasEvolution: 'all',
    searchTerm: ''
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    handleFilterChange('types', newTypes);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      generation: 0,
      types: [],
      minStats: 0,
      maxStats: 800,
      hasEvolution: 'all',
      searchTerm: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      normal: 'bg-gray-400', fighting: 'bg-red-700', flying: 'bg-indigo-400',
      poison: 'bg-purple-500', ground: 'bg-yellow-400', rock: 'bg-yellow-600',
      bug: 'bg-green-400', ghost: 'bg-purple-700', steel: 'bg-gray-500',
      fire: 'bg-red-500', water: 'bg-blue-500', grass: 'bg-green-500',
      electric: 'bg-yellow-500', psychic: 'bg-pink-500', ice: 'bg-blue-300',
      dragon: 'bg-indigo-700', dark: 'bg-gray-800', fairy: 'bg-pink-300'
    };
    return colorMap[type] || 'bg-gray-400';
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="w-full mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
      >
        <span>🔍</span>
        <span>{t('advanced_filters', language)}</span>
        <span>↓</span>
      </button>
    );
  }

  return (
    <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t('advanced_filters', language)}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            {t('clear_all', language)}
          </button>
          <button
            onClick={onToggle}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            ↑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 세대 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {t('generation', language)}
          </label>
          <select
            value={filters.generation}
            onChange={(e) => handleFilterChange('generation', parseInt(e.target.value))}
            className="w-full select-field"
          >
            {GENERATIONS.map(gen => (
              <option key={gen.id} value={gen.id}>
                {language === 'en' ? gen.englishName : 
                 language === 'ja' ? gen.japaneseName : 
                 gen.koreanName}
              </option>
            ))}
          </select>
        </div>

        {/* 진화 여부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {t('evolution_filter', language)}
          </label>
          <select
            value={filters.hasEvolution}
            onChange={(e) => handleFilterChange('hasEvolution', e.target.value)}
            className="w-full select-field"
          >
            <option value="all">{t('all_pokemon', language)}</option>
            <option value="yes">{t('can_evolve', language)}</option>
            <option value="no">{t('cannot_evolve', language)}</option>
          </select>
        </div>

        {/* 종족값 범위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {t('total_base_stats', language)}: {filters.minStats} - {filters.maxStats}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="800"
              value={filters.minStats}
              onChange={(e) => handleFilterChange('minStats', parseInt(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="800"
              value={filters.maxStats}
              onChange={(e) => handleFilterChange('maxStats', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 타입 선택 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
          {t('types', language)} ({filters.types.length} {t('selected', language)})
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
          {POKEMON_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                filters.types.includes(type)
                  ? `${getTypeColor(type)} ring-2 ring-blue-500 scale-105`
                  : `${getTypeColor(type)} opacity-60 hover:opacity-80`
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 검색어 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {t('search_by_name', language)}
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          placeholder={t('enter_pokemon_name', language)}
          className="w-full input-field"
        />
      </div>

      {/* 적용된 필터 요약 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.generation !== 0 && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
            {t('generation', language)} {filters.generation}
          </span>
        )}
        {filters.types.map(type => (
          <span key={type} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded text-xs">
            {type}
          </span>
        ))}
        {filters.hasEvolution !== 'all' && (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
            {filters.hasEvolution === 'yes' ? t('can_evolve', language) : t('cannot_evolve', language)}
          </span>
        )}
        {(filters.minStats > 0 || filters.maxStats < 800) && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
            {t('total_base_stats', language)}: {filters.minStats}-{filters.maxStats}
          </span>
        )}
      </div>
    </div>
  );
}

export default AdvancedFilters;
