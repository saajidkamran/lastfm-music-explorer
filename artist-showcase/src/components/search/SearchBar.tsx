
import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMusicStore } from '../../store/store';
import  type { SearchType } from '../../utils/types';
import { Box, Flex, Input, Button } from '@chakra-ui/react';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, searchType, setSearchType, executeSearch } = useMusicStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    // On initial load, execute search with the default term
    executeSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    executeSearch();
  };
  
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    if (localSearchTerm) {
        // Automatically search when type changes if there is a search term
        executeSearch();
    }
  };

  return (
    <Box mb={8} p={6} bg="rgba(31, 41, 55, 0.6)" borderRadius="xl" boxShadow="lg" backdropFilter="blur(8px)">
      <form onSubmit={handleSearch}>
        <Flex flexDirection={{ base: 'column', sm: 'row' }} gap={4}>
          <Input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search for an album or track..."
            flex="1"
            bg="gray.700"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            border="2px"
            borderColor="transparent"
            _focus={{ borderColor: 'pink.500', boxShadow: 'none' }}
            borderRadius="lg"
            px={4}
            py={3}
            transition="all"
            transitionDuration="300ms"
          />
          <Button
            type="submit"
            bg="pink.600"
            _hover={{ bg: 'pink.700' }}
            color="white"
            fontWeight="bold"
            py={3}
            px={6}
            borderRadius="lg"
            transition="colors"
            transitionDuration="300ms"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20px"
              height="20px"
              style={{ marginRight: '8px' }}
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search
          </Button>
        </Flex>
      </form>
      <Flex
        mt={4}
        justify="center"
        gap={2}
        bg="rgba(55, 65, 81, 0.5)"
        p={1}
        borderRadius="lg"
        w={{ base: '100%', sm: 'auto' }}
        maxW={{ sm: 'xs' }}
        mx="auto"
      >
        <Button
          onClick={() => handleTypeChange('album')}
          w={{ base: '100%', sm: 'auto' }}
          textAlign="center"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="semibold"
          borderRadius="md"
          transition="colors"
          transitionDuration="300ms"
          bg={searchType === 'album' ? 'pink.600' : 'transparent'}
          color={searchType === 'album' ? 'white' : 'gray.300'}
          _hover={{ bg: searchType === 'album' ? 'pink.600' : 'rgba(55, 65, 81, 0.5)' }}
        >
          Albums
        </Button>
        <Button
          onClick={() => handleTypeChange('track')}
          w={{ base: '100%', sm: 'auto' }}
          textAlign="center"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="semibold"
          borderRadius="md"
          transition="colors"
          transitionDuration="300ms"
          bg={searchType === 'track' ? 'pink.600' : 'transparent'}
          color={searchType === 'track' ? 'white' : 'gray.300'}
          _hover={{ bg: searchType === 'track' ? 'pink.600' : 'rgba(55, 65, 81, 0.5)' }}
        >
          Tracks
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchBar;
