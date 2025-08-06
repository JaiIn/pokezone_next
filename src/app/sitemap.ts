import { MetadataRoute } from 'next';
import { GENERATIONS } from '@/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pokezone.vercel.app';
  
  // 기본 페이지들
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/worldcup`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];
  
  // 세대별 페이지 추가
  const generationRoutes = GENERATIONS.filter(gen => gen.id !== 0).map(gen => ({
    url: `${baseUrl}/generation/${gen.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // 인기 포켓몬 페이지들 (첫 151마리)
  const pokemonRoutes = Array.from({ length: 151 }, (_, i) => ({
    url: `${baseUrl}/pokemon/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  return [...routes, ...generationRoutes, ...pokemonRoutes];
}
