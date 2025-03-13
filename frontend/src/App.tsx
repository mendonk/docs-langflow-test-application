import { useState, useRef } from 'react';
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  VStack,
  Container,
  Heading,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { PokemonCard } from './components/PokemonCard';
import { searchPokemon } from './services/api';
import { Pokemon } from './types/pokemon';
import axios, { CancelTokenSource } from 'axios';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const toast = useToast();

  const handleStop = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Search cancelled by user');
      cancelTokenRef.current = null;
      setIsLoading(false);
      toast({
        title: 'Search Cancelled',
        description: 'Pokemon search was cancelled',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a Pokemon name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Cancel any ongoing request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New search started');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();
    setIsLoading(true);

    try {
      const response = await searchPokemon(
        searchTerm.toLowerCase(),
        cancelTokenRef.current
      );
      setPokemon(response.result.pokemon);
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast({
          title: 'Error',
          description: 'Failed to fetch Pokemon data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setPokemon(null);
      }
    } finally {
      if (cancelTokenRef.current) {
        cancelTokenRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" py={8} bg="gray.50">
        <Container maxW="container.md">
          <VStack spacing={8}>
            <Heading>Pokédex</Heading>
            
            <Box w="100%" display="flex" gap={4}>
              <Input
                placeholder="Enter Pokemon name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <HStack spacing={2}>
                <Button
                  colorScheme="blue"
                  onClick={handleSearch}
                  isLoading={isLoading}
                  loadingText="Searching..."
                  isDisabled={isLoading}
                >
                  Search
                </Button>
                {isLoading && (
                  <Button
                    colorScheme="red"
                    onClick={handleStop}
                    variant="outline"
                  >
                    Stop
                  </Button>
                )}
              </HStack>
            </Box>

            {pokemon && <PokemonCard pokemon={pokemon} />}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;