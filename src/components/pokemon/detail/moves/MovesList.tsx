'use client';

import React from 'react';
import { Move } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';
import { MoveWithMetadata, MoveStats } from '@/utils/movesUtils';
import { MoveCard } from './MoveCard';
import { t } from '@/utils/translations';

interface MovesSectionProps {
  title: string;
  description: string;
  moves: MoveWithMetadata[];
  colorClass: string;
  moveDetails: { [key: string]: Move };
  onLoadDetail: (moveName: string) => void;
  emptyMessage?: string;
}

export function MovesSection({ 
  title, 
  description, 
  moves, 
  colorClass, 
  moveDetails, 
  onLoadDetail,
  emptyMessage = 'No moves available'
}: MovesSectionProps) {
  const { language } = useLanguage();

  if (moves.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-slate-400">
        <div className="text-4xl mb-2">📝</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          {description}
        </p>
        <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
          {moves.length} moves available
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {moves.map((moveData, index) => (
          <MoveCard
            key={`${moveData.move.name}-${index}`}
            moveData={moveData}
            colorClass={colorClass}
            moveDetail={moveDetails[moveData.move.name]}
            onLoadDetail={onLoadDetail}
          />
        ))}
      </div>
    </div>
  );
}

interface MovesListProps {
  pokemon: any;
  moveDetails: { [key: string]: Move };
  onLoadDetail: (moveName: string) => void;
}

export function MovesList({ pokemon, moveDetails, onLoadDetail }: MovesListProps) {
  const { language } = useLanguage();
  
  if (!pokemon?.moves || pokemon.moves.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚔️</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
          No moves data available
        </h3>
        <p className="text-gray-500 dark:text-slate-400">
          This Pokemon's moveset information could not be loaded.
        </p>
      </div>
    );
  }

  // 기술을 카테고리별로 분류
  const levelUpMoves: MoveWithMetadata[] = [];
  const machineMoves: MoveWithMetadata[] = [];
  const otherMoves: MoveWithMetadata[] = [];

  pokemon.moves.forEach((pokemonMove: any) => {
    const moveDetails = pokemonMove.version_group_details;
    
    // 최신 버전 그룹의 학습 방법을 찾기
    const levelUpDetail = moveDetails.find((detail: any) => 
      detail.move_learn_method.name === 'level-up'
    );
    const machineDetail = moveDetails.find((detail: any) => 
      detail.move_learn_method.name === 'machine'
    );
    const otherDetail = moveDetails.find((detail: any) => 
      detail.move_learn_method.name !== 'level-up' && 
      detail.move_learn_method.name !== 'machine'
    );

    if (levelUpDetail) {
      levelUpMoves.push({
        move: pokemonMove.move,
        level: levelUpDetail.level_learned_at
      });
    } else if (machineDetail) {
      machineMoves.push({
        move: pokemonMove.move
      });
    } else if (otherDetail) {
      otherMoves.push({
        move: pokemonMove.move,
        method: otherDetail.move_learn_method.name
      });
    }
  });

  // 레벨업 기술을 레벨순으로 정렬
  levelUpMoves.sort((a, b) => (a.level || 0) - (b.level || 0));

  return (
    <div className="space-y-8">
      {/* 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {levelUpMoves.length}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            Level-up
          </div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {machineMoves.length}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            TM/TR
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {otherMoves.length}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            Special
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-600 dark:text-slate-400">
            {pokemon.moves.length}
          </div>
          <div className="text-sm text-gray-700 dark:text-slate-300">
            Total
          </div>
        </div>
      </div>

      {/* 레벨업 기술 */}
      <MovesSection
        title={t('level_up_moves', language)}
        description={t('moves_learned_naturally', language)}
        moves={levelUpMoves}
        colorClass="green"
        moveDetails={moveDetails}
        onLoadDetail={onLoadDetail}
        emptyMessage="No level-up moves available"
      />

      {/* TM/TR 기술 */}
      <MovesSection
        title={t('tm_tr_moves', language)}
        description={t('moves_learned_tm', language)}
        moves={machineMoves}
        colorClass="blue"
        moveDetails={moveDetails}
        onLoadDetail={onLoadDetail}
        emptyMessage="No TM/TR moves available"
      />

      {/* 특수 기술 */}
      {otherMoves.length > 0 && (
        <MovesSection
          title={t('special_moves', language)}
          description={t('moves_learned_special', language)}
          moves={otherMoves}
          colorClass="purple"
          moveDetails={moveDetails}
          onLoadDetail={onLoadDetail}
          emptyMessage="No special moves available"
        />
      )}
    </div>
  );
}

export default MovesList;
