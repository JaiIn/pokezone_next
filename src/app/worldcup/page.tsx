import { Metadata } from 'next';
import PokemonWorldCupPage from '@/components/worldcup/PokemonWorldCupPage';

export const metadata: Metadata = {
  title: 'Pokemon World Cup | PokéZone',
  description: 'Tournament-style Pokemon elimination game. Choose your favorite Pokemon and compete!',
  keywords: ['pokemon', 'tournament', 'world cup', 'game', 'elimination', 'favorite'],
  openGraph: {
    title: 'Pokemon World Cup - PokéZone',
    description: 'Tournament-style Pokemon elimination game. Find your ultimate favorite Pokemon!',
    images: [
      {
        url: '/og-worldcup.png',
        width: 1200,
        height: 630,
        alt: 'Pokemon World Cup Tournament',
      },
    ],
  },
};

export default function WorldCupPage() {
  return <PokemonWorldCupPage />;
}
