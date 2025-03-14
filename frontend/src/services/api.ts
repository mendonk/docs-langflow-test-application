import axios, { CancelTokenSource } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7860/api/v1';
const FLOW_ID = 'e4167236-938f-4aca-845b-21de3f399858';

interface PokemonData {
  name: string;
  id?: string;
  height?: string;
  weight?: string;
  baseExperience?: string;
  types?: string[];
  abilities?: Array<{
    name: string;
    description: string;
  }>;
  stats?: Array<{
    name: string;
    value: number;
  }>;
  moves?: string[];
}

interface MessageResponse {
  event: string;
  data: {
    text: string;
    content_blocks?: Array<{
      type?: string;
      content?: string;
      title?: string;
      contents?: Array<{
        text?: string;
      }>;
    }>;
  };
}

function parsePokemonText(text: string): PokemonData {
  const lines = text.split('\n');
  const pokemon: PokemonData = {
    name: '',
    types: [],
    abilities: [],
    stats: [],
    moves: []
  };

  let currentSection = '';

  lines.forEach(line => {
    if (!line.trim()) return;

    // Extract name from first line
    if (!pokemon.name && line.trim()) {
      pokemon.name = line.trim();
      return;
    }

    // Parse ID, Height, Weight, Base Experience
    if (line.includes('ID:')) pokemon.id = line.split('ID:')[1].trim();
    if (line.includes('Height:')) pokemon.height = line.split('Height:')[1].trim();
    if (line.includes('Weight:')) pokemon.weight = line.split('Weight:')[1].trim();
    if (line.includes('Base Experience:')) pokemon.baseExperience = line.split('Base Experience:')[1].trim();

    // Track sections
    if (line.includes('Types')) {
      currentSection = 'types';
      return;
    } else if (line.includes('Abilities')) {
      currentSection = 'abilities';
      return;
    } else if (line.includes('Base Stats')) {
      currentSection = 'stats';
      return;
    } else if (line.includes('Moves')) {
      currentSection = 'moves';
      return;
    } else if (line.includes('Sprites') || line.includes('Cry') || line.includes('Encounter')) {
      currentSection = '';
      return;
    }

    // Parse sections
    switch (currentSection) {
      case 'types':
        if (!line.includes(':')) pokemon.types?.push(line.trim());
        break;
      case 'abilities':
        if (line.includes(':')) {
          const [name, description] = line.split(':');
          pokemon.abilities?.push({
            name: name.trim(),
            description: description.trim()
          });
        }
        break;
      case 'stats':
        if (line.includes(':')) {
          const [name, value] = line.split(':');
          pokemon.stats?.push({
            name: name.trim(),
            value: parseInt(value.trim())
          });
        }
        break;
      case 'moves':
        if (!line.includes('can learn') && line.trim()) {
          pokemon.moves?.push(line.trim());
        }
        break;
    }
  });

  return pokemon;
}

export const searchPokemon = async (
  pokemonName: string,
  cancelToken: CancelTokenSource
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/run/${FLOW_ID}?stream=true`,
      {
        input_value: `Tell me about ${pokemonName}`,
        output_type: 'chat',
        input_type: 'chat'
      },
      {
        cancelToken: cancelToken.token,
      }
    );

    // Return the raw response data
    return JSON.stringify(response.data, null, 2);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
    } else {
      console.error('Error fetching Pokemon:', error);
    }
    throw error;
  }
}; 