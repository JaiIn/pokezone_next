import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PokemonDetailPage from '@/components/pokemon/PokemonDetailPage';
import { PokemonService } from '@/services/pokemonService';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const pokemon = await PokemonService.getPokemon(params.id);
    const species = await PokemonService.getPokemonSpecies(pokemon.id);
    
    const pokemonName = species.names.find(name => name.language.name === 'en')?.name || pokemon.name;
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'Pokemon details';
    
    return {
      title: `${pokemonName} #${pokemon.id.toString().padStart(3, '0')} | PokéZone`,
      description: description.replace(/\f/g, ' ').replace(/\n/g, ' '),
      keywords: [pokemonName, 'pokemon', 'pokedex', 'stats', 'abilities', 'moves'],
      openGraph: {
        title: `${pokemonName} - Pokemon #${pokemon.id}`,
        description: description.replace(/\f/g, ' ').replace(/\n/g, ' '),
        images: [
          {
            url: pokemon.sprites.other['official-artwork'].front_default,
            width: 512,
            height: 512,
            alt: pokemonName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${pokemonName} - Pokemon #${pokemon.id}`,
        description: description.replace(/\f/g, ' ').replace(/\n/g, ' '),
        images: [pokemon.sprites.other['official-artwork'].front_default],
      },
    };
  } catch (error) {
    return {
      title: 'Pokemon Not Found | PokéZone',
      description: 'The requested Pokemon could not be found.',
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    // 서버에서 초기 데이터를 가져와서 클라이언트 컴포넌트에 전달
    const pokemon = await PokemonService.getPokemon(params.id);
    const species = await PokemonService.getPokemonSpecies(pokemon.id);
    
    return (
      <PokemonDetailPage 
        initialPokemon={pokemon}
        initialSpecies={species}
        pokemonId={params.id}
      />
    );
  } catch (error) {
    notFound();
  }
}

// ISR: 1시간마다 재생성
export const revalidate = 3600;

// 인기 있는 포켓몬들을 미리 생성
export async function generateStaticParams() {
  // 처음 151마리 포켓몬 (1세대) 미리 생성
  const popularPokemon = Array.from({ length: 151 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
  
  return popularPokemon;
}
