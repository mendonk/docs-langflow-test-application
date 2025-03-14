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
  Text,
  Divider,
  Textarea,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { searchPokemon } from './services/api';
import { sendChatMessage } from './services/chatService';
import axios, { CancelTokenSource } from 'axios';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonResponse, setPokemonResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
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

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New search started');
    }

    cancelTokenRef.current = axios.CancelToken.source();
    setIsLoading(true);
    setPokemonResponse('');

    try {
      const response = await searchPokemon(
        searchTerm.toLowerCase(),
        cancelTokenRef.current
      );
      setPokemonResponse(response);
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast({
          title: 'Error',
          description: 'Failed to fetch Pokemon data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      if (cancelTokenRef.current) {
        cancelTokenRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsChatLoading(true);
    try {
      const response = await sendChatMessage(chatInput);
      setChatResponse(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get chat response',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" py={8} bg="gray.50">
        <Container maxW="container.md">
          <VStack spacing={8}>
            <Heading>Pokédex & Chat</Heading>
            
            {/* Pokédex Section */}
            <Box w="100%">
              <Heading size="md" mb={4}>Pokédex Search</Heading>
              <Box display="flex" gap={4}>
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
              {pokemonResponse && (
                <Card mt={4} variant="outline" bg="white" boxShadow="sm">
                  <CardBody>
                    <Text
                      as="pre"
                      whiteSpace="pre-wrap"
                      fontSize="sm"
                      fontFamily="monospace"
                    >
                      {pokemonResponse}
                    </Text>
                  </CardBody>
                </Card>
              )}
            </Box>

            <Divider />

            {/* Chat Section */}
            <Box w="100%">
              <Heading size="md" mb={4}>Chat</Heading>
              <VStack spacing={4} align="stretch">
                {chatResponse && (
                  <Card variant="outline" bg="white" boxShadow="sm">
                    <CardBody>
                      <Text
                        whiteSpace="pre-wrap"
                        fontSize="md"
                        lineHeight="tall"
                      >
                        {chatResponse}
                      </Text>
                    </CardBody>
                  </Card>
                )}
                <Textarea
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
                  rows={3}
                  bg="white"
                />
                <Button
                  colorScheme="green"
                  onClick={handleChat}
                  isLoading={isChatLoading}
                  loadingText="Sending..."
                >
                  Send Message
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;