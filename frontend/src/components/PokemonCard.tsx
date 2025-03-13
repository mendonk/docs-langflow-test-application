import { Box, Image, Text, VStack, HStack, Progress, Badge } from '@chakra-ui/react';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="lg"
    >
      <VStack spacing={4}>
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          boxSize="200px"
          objectFit="contain"
        />
        
        <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
          {pokemon.name}
        </Text>

        <HStack spacing={2}>
          {pokemon.types.map((type) => (
            <Badge key={type} colorScheme="teal">
              {type}
            </Badge>
          ))}
        </HStack>

        <Box w="100%">
          <Text fontWeight="bold" mb={2}>Stats</Text>
          <VStack spacing={2} align="stretch">
            <Box>
              <Text fontSize="sm">HP</Text>
              <Progress value={pokemon.stats.hp} max={255} colorScheme="green" />
            </Box>
            <Box>
              <Text fontSize="sm">Attack</Text>
              <Progress value={pokemon.stats.attack} max={255} colorScheme="red" />
            </Box>
            <Box>
              <Text fontSize="sm">Defense</Text>
              <Progress value={pokemon.stats.defense} max={255} colorScheme="blue" />
            </Box>
            <Box>
              <Text fontSize="sm">Special Attack</Text>
              <Progress value={pokemon.stats.specialAttack} max={255} colorScheme="purple" />
            </Box>
            <Box>
              <Text fontSize="sm">Special Defense</Text>
              <Progress value={pokemon.stats.specialDefense} max={255} colorScheme="yellow" />
            </Box>
            <Box>
              <Text fontSize="sm">Speed</Text>
              <Progress value={pokemon.stats.speed} max={255} colorScheme="pink" />
            </Box>
          </VStack>
        </Box>

        <Box w="100%">
          <Text fontWeight="bold" mb={2}>Abilities</Text>
          <HStack spacing={2} wrap="wrap">
            {pokemon.abilities.map((ability) => (
              <Badge key={ability} colorScheme="purple">
                {ability}
              </Badge>
            ))}
          </HStack>
        </Box>

        <HStack spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">Height</Text>
            <Text>{pokemon.height / 10}m</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Weight</Text>
            <Text>{pokemon.weight / 10}kg</Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}; 