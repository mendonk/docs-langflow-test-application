import axios, { CancelTokenSource } from 'axios';
import { PokemonResponse } from '../types/pokemon';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const searchPokemon = async (
  pokemonName: string,
  cancelToken: CancelTokenSource
): Promise<PokemonResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/run/chat`,
      {
        input_value: `Tell me about ${pokemonName}`,
        output_type: 'chat',
        input_type: 'chat',
        session_id: '',
        flow_id: 'pokedex-agent',
      },
      {
        cancelToken: cancelToken.token,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
    } else {
      console.error('Error fetching Pokemon:', error);
    }
    throw error;
  }
}; 