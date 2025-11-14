
import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMusicStore } from '../../store/store';
import  type { SearchType } from '../../utils/types';
import { Box, Flex, Input, Button } from '@chakra-ui/react';
import { searchBarStyles, svgIconStyles } from '../../utils/styles';

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
    <Box {...searchBarStyles.container}>
      <form onSubmit={handleSearch}>
        <Flex flexDirection={{ base: 'column', sm: 'row' }} gap={4}>
          <Input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search for an album or track..."
            {...searchBarStyles.input}
            _placeholder={searchBarStyles.inputPlaceholder}
            _focus={searchBarStyles.inputFocus}
          />
          <Button
            type="submit"
            {...searchBarStyles.searchButton}
            _hover={searchBarStyles.searchButtonHover}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={svgIconStyles.searchIcon}
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search
          </Button>
        </Flex>
      </form>
      <Flex {...searchBarStyles.typeSelectorContainer}>
        <Button
          onClick={() => handleTypeChange('album')}
          {...searchBarStyles.typeButton}
          {...(searchType === 'album' ? searchBarStyles.typeButtonActive : searchBarStyles.typeButtonInactive)}
          _hover={searchType === 'album' ? searchBarStyles.typeButtonActive : searchBarStyles.typeButtonHover}
        >
          Albums
        </Button>
        <Button
          onClick={() => handleTypeChange('track')}
          {...searchBarStyles.typeButton}
          {...(searchType === 'track' ? searchBarStyles.typeButtonActive : searchBarStyles.typeButtonInactive)}
          _hover={searchType === 'track' ? searchBarStyles.typeButtonActive : searchBarStyles.typeButtonHover}
        >
          Tracks
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchBar;
