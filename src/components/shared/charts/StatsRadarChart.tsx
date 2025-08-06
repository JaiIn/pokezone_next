'use client';

import React from 'react';
import { Pokemon } from '@/types';
import { PokemonService } from '@/services/pokemonService';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsRadarChartProps {
  pokemon: Pokemon;
  className?: string;
}

export function StatsRadarChart({ pokemon, className = '' }: StatsRadarChartProps) {
  const { language } = useLanguage();
  
  // SVG 차트 설정
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 5;
  
  const stats = pokemon.stats.map(stat => ({
    name: PokemonService.formatStatName(stat.stat.name, language),
    value: stat.base_stat,
    max: 255
  }));

  // 각 스탯의 각도 계산 (6각형)
  const getAngle = (index: number) => (index * 60 - 90) * (Math.PI / 180);
  
  // 스탯 값에 따른 반지름 계산
  const getRadius = (value: number, max: number) => (value / max) * maxRadius;

  // 육각형의 각 꼭짓점 좌표 계산
  const getPoint = (angle: number, radius: number) => ({
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius
  });

  // 배경 육각형 경로 생성
  const createHexagonPath = (radius: number) => {
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = getAngle(i);
      return getPoint(angle, radius);
    });
    
    return `M ${points[0].x} ${points[0].y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  // 스탯 데이터 경로 생성
  const createStatsPath = () => {
    const points = stats.map((stat, i) => {
      const angle = getAngle(i);
      const radius = getRadius(stat.value, stat.max);
      return getPoint(angle, radius);
    });
    
    return `M ${points[0].x} ${points[0].y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  // 각 스탯 레이블 위치
  const labelPositions = stats.map((stat, i) => {
    const angle = getAngle(i);
    const labelRadius = maxRadius + 20;
    return {
      ...getPoint(angle, labelRadius),
      name: stat.name,
      value: stat.value
    };
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size + 60} height={size + 60} className="overflow-visible">
        {/* 배경 육각형들 */}
        {Array.from({ length: levels }, (_, i) => {
          const radius = ((i + 1) / levels) * maxRadius;
          return (
            <path
              key={i}
              d={createHexagonPath(radius)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
              className="text-gray-300 dark:text-slate-600"
            />
          );
        })}
        
        {/* 축선 */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = getAngle(i);
          const endPoint = getPoint(angle, maxRadius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
              className="text-gray-300 dark:text-slate-600"
            />
          );
        })}
        
        {/* 스탯 데이터 영역 */}
        <path
          d={createStatsPath()}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* 스탯 포인트 */}
        {stats.map((stat, i) => {
          const angle = getAngle(i);
          const radius = getRadius(stat.value, stat.max);
          const point = getPoint(angle, radius);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          );
        })}
        
        {/* 스탯 레이블 */}
        {labelPositions.map((pos, i) => (
          <g key={i}>
            <text
              x={pos.x}
              y={pos.y - 5}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700 dark:fill-slate-300"
            >
              {pos.name}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor="middle"
              className="text-xs font-bold fill-blue-600 dark:fill-blue-400"
            >
              {pos.value}
            </text>
          </g>
        ))}
      </svg>
      
      {/* 총 종족값 */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
        </div>
        <div className="text-sm text-gray-500 dark:text-slate-400">
          Total Base Stats
        </div>
      </div>
    </div>
  );
}

export default StatsRadarChart;
