'use client';

import React, { useState, useEffect } from 'react';
import { Move } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { MoveWithMetadata } from '@/utils/movesUtils';

interface MoveStatsDisplayProps {
  move: Move;
}

const MoveStatsDisplay = React.memo(({ move }: MoveStatsDisplayProps) => {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-slate-400">
      <div className="text-center">
        <div className="font-medium">{move.power || '-'}</div>
        <div>Power</div>
      </div>
      <div className="text-center">
        <div className="font-medium">{move.accuracy || '-'}</div>
        <div>Accuracy</div>
      </div>
      <div className="text-center">
        <div className="font-medium">{move.pp}</div>
        <div>PP</div>
      </div>
    </div>
  );
});

MoveStatsDisplay.displayName = 'MoveStatsDisplay';

interface MoveCardProps {
  moveData: MoveWithMetadata;
  colorClass?: string;
  moveDetail?: Move;
  onLoadDetail: (moveName: string) => void;
}

export const MoveCard = React.memo(({ moveData, colorClass = 'green', moveDetail, onLoadDetail }: MoveCardProps) => {
  const { language } = useLanguage();
  const { move, level, method } = moveData;
  const [localizedName, setLocalizedName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoveName = async () => {
      try {
        // 먼저 기본 영어 이름으로 표시
        const fallbackName = PokemonService.formatSimpleMoveName(move.name);
        setLocalizedName(fallbackName);
        setLoading(false);

        // 만약 moveDetail이 있다면 그것을 사용
        if (moveDetail) {
          const formattedName = PokemonService.formatMoveName(moveDetail, language);
          setLocalizedName(formattedName);
        } else if (language !== 'en') {
          // 비동기로 정확한 번역 로드 (영어가 아닐 때만)
          try {
            const asyncName = await PokemonService.formatMoveNameAsync(move.name, language);
            if (asyncName !== fallbackName) {
              setLocalizedName(asyncName);
            }
          } catch (error) {
            console.warn(`Failed to load localized name for ${move.name}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to load move name for ${move.name}:`, error);
        setLocalizedName(PokemonService.formatSimpleMoveName(move.name));
        setLoading(false);
      }
    };

    loadMoveName();
  }, [move.name, language, moveDetail]);

  const getLabelContent = () => {
    if (level !== undefined) {
      return `🌱 Level ${level}`;
    }
    if (method) {
      return `✨ ${PokemonService.formatLearnMethodName(method)}`;
    }
    return '🔧 TM/TR';
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string; border: string } } = {
      green: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        hover: 'group-hover:text-green-600 dark:group-hover:text-green-400',
        border: 'hover:border-green-300 dark:hover:border-green-500'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200',
        hover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
        border: 'hover:border-blue-300 dark:hover:border-blue-500'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-200',
        hover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
        border: 'hover:border-purple-300 dark:hover:border-purple-500'
      }
    };
    return colorMap[color] || colorMap.green;
  };

  const colors = getColorClasses(colorClass);

  return (
    <div
      className={`group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent ${colors.border}`}
      onClick={() => onLoadDetail(move.name)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}>
          {getLabelContent()}
        </span>
        {moveDetail && (
          <span
            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetail.type.name)}`}
          >
            {PokemonService.formatTypeName(moveDetail.type.name, language)}
          </span>
        )}
      </div>
      
      <div className={`font-medium text-gray-900 dark:text-slate-100 ${colors.hover} transition-colors`}>
        {loading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-slate-600 rounded h-4 w-24"></div>
        ) : (
          localizedName
        )}
      </div>
      
      {moveDetail && <MoveStatsDisplay move={moveDetail} />}
      
      {/* 클릭 힌트 */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 dark:text-slate-400 mt-1">
        Click for details
      </div>
    </div>
  );
});

MoveCard.displayName = 'MoveCard';

export default MoveCard;
