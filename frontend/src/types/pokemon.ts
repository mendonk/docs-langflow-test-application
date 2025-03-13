export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  sprites: {
    front_default: string;
    back_default: string;
  };
}

export interface PokemonResponse {
  source: string;
  result: {
    pokemon: Pokemon;
  };
} 