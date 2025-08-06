import { Metadata } from 'next';
import PokemonComparePage from '@/components/compare/PokemonComparePage';

export const metadata: Metadata = {
  title: 'Pokemon Compare | PokéZone',
  description: 'Compare two Pokemon side by side - stats, types, abilities, and more',
  keywords: ['pokemon', 'compare', 'stats', 'battle', 'vs'],
  openGraph: {
    title: 'Pokemon Compare - PokéZone',
    description: 'Compare two Pokemon side by side and see their stats, types, and abilities',
    images: [
      {
        url: '/og-compare.png',
        width: 1200,
        height: 630,
        alt: 'Pokemon Compare Tool',
      },
    ],
  },
};

export default function ComparePage() {
  return <PokemonComparePage />;
}
