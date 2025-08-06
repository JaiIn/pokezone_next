import { t } from './translations';
import { Language } from '@/contexts/LanguageContext';

export interface EvolutionPokemon {
  name: string;
  id: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
  timeOfDay?: string;
  location?: string;
  friendship?: boolean;
  trade?: boolean;
}

export const STONE_NAMES: { [key: string]: { ko: string; en: string; ja: string } } = {
  'fire-stone': { ko: '불꽃의돌', en: 'Fire Stone', ja: 'かえんのいし' },
  'water-stone': { ko: '물의돌', en: 'Water Stone', ja: 'みずのいし' },
  'thunder-stone': { ko: '번개의돌', en: 'Thunder Stone', ja: 'かみなりのいし' },
  'leaf-stone': { ko: '잎의돌', en: 'Leaf Stone', ja: 'リーフのいし' },
  'moon-stone': { ko: '달의돌', en: 'Moon Stone', ja: 'つきのいし' },
  'sun-stone': { ko: '태양의돌', en: 'Sun Stone', ja: 'たいようのいし' },
  'shiny-stone': { ko: '빛의돌', en: 'Shiny Stone', ja: 'ひかりのいし' },
  'dusk-stone': { ko: '어둠의돌', en: 'Dusk Stone', ja: 'やみのいし' },
  'dawn-stone': { ko: '각성의돌', en: 'Dawn Stone', ja: 'めざめのいし' },
  'ice-stone': { ko: '얼음의돌', en: 'Ice Stone', ja: 'こおりのいし' }
};

export const TIME_NAMES: { [key: string]: { ko: string; en: string; ja: string } } = {
  'day': { ko: '낮 시간', en: 'Day', ja: '昼' },
  'night': { ko: '밤 시간', en: 'Night', ja: '夜' }
};

export const getPokemonIdFromUrl = (url: string): string => {
  const match = url.match(/\/pokemon-species\/(\d+)\//);
  return match ? match[1] : '1';
};

export const getEvolutionCondition = (evolutionDetails: any[], language: Language = 'en'): string => {
  if (!evolutionDetails || evolutionDetails.length === 0) {
    return '';
  }

  const detail = evolutionDetails[0];
  const conditions: string[] = [];

  if (detail.min_level) {
    conditions.push(`${t('level', language)} ${detail.min_level}`);
  }

  if (detail.item) {
    const itemName = detail.item.name;
    const stone = STONE_NAMES[itemName];
    if (stone) {
      conditions.push(stone[language] || stone.en);
    } else {
      conditions.push(itemName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    }
  }

  if (detail.time_of_day) {
    const timeNames = TIME_NAMES[detail.time_of_day];
    if (timeNames) {
      conditions.push(timeNames[language] || timeNames.en);
    }
  }

  if (detail.min_happiness) {
    conditions.push(`${t('friendship', language)} ${detail.min_happiness}+`);
  }

  if (detail.trigger?.name === 'trade') {
    conditions.push(t('trade', language));
    if (detail.held_item) {
      conditions.push(`+ ${detail.held_item.name}`);
    }
  }

  if (detail.location) {
    conditions.push(t('special_location', language));
  }

  if (detail.known_move) {
    conditions.push(`${t('learn_move', language)}: ${detail.known_move.name}`);
  }

  if (detail.party_species) {
    conditions.push(t('party_pokemon', language));
  }

  return conditions.length > 0 ? conditions.join(' • ') : t('special_condition', language);
};

export const processEvolutionChain = (chain: any): EvolutionPokemon[][] => {
  const stages: EvolutionPokemon[][] = [];

  const traverse = (node: any, stageIndex: number) => {
    if (!stages[stageIndex]) {
      stages[stageIndex] = [];
    }

    const pokemon: EvolutionPokemon = {
      name: node.species.name,
      id: getPokemonIdFromUrl(node.species.url)
    };

    if (stageIndex > 0 && node.evolution_details && node.evolution_details.length > 0) {
      const detail = node.evolution_details[0];
      pokemon.minLevel = detail.min_level;
      pokemon.trigger = detail.trigger?.name;
      pokemon.item = detail.item?.name;
      pokemon.timeOfDay = detail.time_of_day;
      pokemon.location = detail.location?.name;
      pokemon.friendship = detail.min_happiness > 0;
      pokemon.trade = detail.trigger?.name === 'trade';
    }

    stages[stageIndex].push(pokemon);

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((evolution: any) => {
        traverse(evolution, stageIndex + 1);
      });
    }
  };

  if (chain.chain) {
    traverse(chain.chain, 0);
  }
  
  return stages;
};

export const formatEvolutionConditions = (pokemon: EvolutionPokemon, language: Language = 'en'): string => {
  const conditions: string[] = [];

  if (pokemon.minLevel) {
    conditions.push(`${t('level', language)} ${pokemon.minLevel}`);
  }

  if (pokemon.item) {
    const stone = STONE_NAMES[pokemon.item];
    if (stone) {
      conditions.push(stone[language] || stone.en);
    } else {
      conditions.push(pokemon.item.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    }
  }

  if (pokemon.timeOfDay) {
    const timeNames = TIME_NAMES[pokemon.timeOfDay];
    if (timeNames) {
      conditions.push(timeNames[language] || timeNames.en);
    }
  }

  if (pokemon.friendship) {
    conditions.push(t('friendship', language));
  }

  if (pokemon.trade) {
    conditions.push(t('trade', language));
  }

  if (pokemon.location) {
    conditions.push(t('special_location', language));
  }

  return conditions.length > 0 ? conditions.join(' • ') : t('evolution', language);
};

export const getStageLabel = (stageIndex: number, language: Language = 'en'): string => {
  switch (stageIndex) {
    case 0:
      return t('basic', language);
    case 1:
      return t('stage_1', language);
    case 2:
      return t('stage_2', language);
    default:
      return t('stage_3', language);
  }
};
