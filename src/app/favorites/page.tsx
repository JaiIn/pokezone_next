import { Metadata } from 'next';
import FavoritesPage from '@/components/favorites/FavoritesPage';

export const metadata: Metadata = {
  title: 'Favorite Pokemon | PokéZone',
  description: 'Your collection of favorite Pokemon',
  keywords: ['pokemon', 'favorites', 'collection', 'saved'],
  openGraph: {
    title: 'Favorite Pokemon - PokéZone',
    description: 'View and manage your favorite Pokemon collection',
    images: [
      {
        url: '/og-favorites.png',
        width: 1200,
        height: 630,
        alt: 'Favorite Pokemon Collection',
      },
    ],
  },
};

export default function Page() {
  return <FavoritesPage />;
}
