'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PokemonService } from '@/services/pokemonService';
import { TypeFormatter } from '@/services/formatters/TypeFormatter';

// Dynamic import로 CSR 컴포넌트들 로드
const PokemonDex = dynamic(() => import('@/components/PokemonDex').then(mod => ({ default: mod.PokemonDex })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="loading-spinner w-16 h-16"></div>
    </div>
  )
});

// Data preloading
async function preloadData() {
  try {
    // 타입 미리 로딩
    await TypeFormatter.preloadCommonTypes('ko');
    await TypeFormatter.preloadCommonTypes('ja');
    
    // 특성 미리 로딩 (한국어/일본어)
    await PokemonService.preloadAbilities('ko');
    await PokemonService.preloadAbilities('ja');
    
    // 기술 미리 로딩 (한국어/일본어)
    await PokemonService.preloadMoves('ko');
    await PokemonService.preloadMoves('ja');
    
    console.log('✅ 데이터 미리 로딩 완료');
  } catch (error) {
    console.warn('데이터 미리 로딩 실패:', error);
  }
}

export default function Home() {
  useEffect(() => {
    preloadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <PokemonDex />
    </main>
  );
}
