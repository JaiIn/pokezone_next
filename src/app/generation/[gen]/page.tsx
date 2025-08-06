import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GenerationPage from '@/components/generation/GenerationPage';
import { GenerationService } from '@/services/generation/GenerationService';
import { GENERATIONS } from '@/types';

interface Props {
  params: { gen: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const genId = parseInt(params.gen);
  
  try {
    const generation = GenerationService.getGenerationInfo(genId);
    
    return {
      title: `${generation.englishName} | PokéZone`,
      description: `Explore all Pokemon from ${generation.englishName} (#${generation.startId}-#${generation.endId})`,
      keywords: ['pokemon', 'generation', generation.name, 'pokedex'],
      openGraph: {
        title: `${generation.englishName} - PokéZone`,
        description: `Discover Pokemon from ${generation.englishName}`,
        images: [
          {
            url: `/og-generation-${genId}.png`,
            width: 1200,
            height: 630,
            alt: generation.englishName,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Generation Not Found | PokéZone',
      description: 'The requested Pokemon generation could not be found.',
    };
  }
}

export default function Page({ params }: Props) {
  const genId = parseInt(params.gen);
  
  try {
    const generation = GenerationService.getGenerationInfo(genId);
    return <GenerationPage generation={generation} />;
  } catch (error) {
    notFound();
  }
}

// 모든 세대 페이지를 미리 생성
export function generateStaticParams() {
  return GENERATIONS.filter(gen => gen.id !== 0).map((gen) => ({
    gen: gen.id.toString(),
  }));
}

export const revalidate = 3600; // 1시간마다 재생성
