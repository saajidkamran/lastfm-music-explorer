import React, { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useMusicStore } from '../../store/store';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import { FavouriteAlbumButton } from '../common/FavouriteAlbumButton';
import type { SearchResultsSortOption } from '../../utils/types';
import { Box, Flex, Text, Grid, VisuallyHidden } from '@chakra-ui/react';

const SearchResults: React.FC = () => {
  const {
    albumResults,
    trackResults,
    loading,
    searchType,
    fetchAlbumDetails,
    fetchArtistDetails,
    searchResultsSort,
    setSearchResultsSort,
  } = useMusicStore();

  const sortedAlbumResults = useMemo(() => {
    if (searchResultsSort === 'relevance') {
      return albumResults;
    }
    const sorted = [...albumResults];
    switch (searchResultsSort) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'artist_asc':
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'artist_desc':
        return sorted.sort((a, b) => b.artist.localeCompare(a.artist));
      case 'year_desc':
        return sorted.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
      case 'year_asc':
        return sorted.sort((a, b) => (a.year || '9999').localeCompare(b.year || '9999'));
      default:
        return sorted;
    }
  }, [albumResults, searchResultsSort]);

  const sortedTrackResults = useMemo(() => {
    if (searchResultsSort === 'relevance') {
      return trackResults;
    }
    const sorted = [...trackResults];
    switch (searchResultsSort) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'artist_asc':
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'artist_desc':
        return sorted.sort((a, b) => b.artist.localeCompare(a.artist));
      case 'listeners_desc':
        return sorted.sort((a, b) => parseInt(b.listeners, 10) - parseInt(a.listeners, 10));
      case 'listeners_asc':
        return sorted.sort((a, b) => parseInt(a.listeners, 10) - parseInt(b.listeners, 10));
      default:
        return sorted;
    }
  }, [trackResults, searchResultsSort]);

  if (loading) {
    return <Spinner />;
  }

  const hasResults =
    searchType === 'album' ? sortedAlbumResults.length > 0 : sortedTrackResults.length > 0;

  if (!hasResults) {
    return (
      <Text textAlign="center" color="gray.400" mt={8}>
        No results found. Try a different search.
      </Text>
    );
  }

  return (
    <Box>
      <Flex
        flexDirection={{ base: 'column', sm: 'row' }}
        justify={{ sm: 'space-between' }}
        align={{ sm: 'center' }}
        gap={4}
        mb={6}
        borderBottom="2px"
        borderColor="gray.700"
        pb={2}
      >
        <Text fontSize="2xl" fontWeight="bold" color="gray.300">
          Search Results
        </Text>
        {hasResults && (
          <Box>
            <VisuallyHidden>
              <label htmlFor="search-sort-select">Sort results by</label>
            </VisuallyHidden>
            <select
              id="search-sort-select"
              value={searchResultsSort}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSearchResultsSort(e.target.value as SearchResultsSortOption)
              }
              style={{
                backgroundColor: '#374151',
                color: 'white',
                border: '2px solid transparent',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 300ms',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ec4899';
                e.target.style.boxShadow = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
              }}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="artist_asc">Artist: A-Z</option>
              <option value="artist_desc">Artist: Z-A</option>
              {searchType === 'album' && (
                <>
                  <option value="year_desc">Year: Newest First</option>
                  <option value="year_asc">Year: Oldest First</option>
                </>
              )}
              {searchType === 'track' && (
                <>
                  <option value="listeners_desc">Most Popular</option>
                  <option value="listeners_asc">Least Popular</option>
                </>
              )}
            </select>
          </Box>
        )}
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)',
        }}
        gap={{ base: 4, md: 6 }}
      >
        {searchType === 'album' &&
          sortedAlbumResults.map((album, index) => (
            <Box
              key={album.mbid ? `${album.mbid}-${index}` : `${album.name}-${album.artist}-${index}`}
              position="relative"
            >
              <Card
                title={album.name}
                subtitle={album.year ? `${album.artist} • ${album.year}` : album.artist}
                images={album.image}
                onClick={() => fetchAlbumDetails(album.artist, album.name)}
                onSubtitleClick={() => fetchArtistDetails(album.artist)}
              />
              <Box
                position="absolute"
                top={2}
                right={2}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity"
                transitionDuration="300ms"
              >
                <FavouriteAlbumButton album={album} />
              </Box>
            </Box>
          ))}
        {searchType === 'track' &&
          sortedTrackResults.map((track, index) => (
            <Box
              key={track.mbid ? `${track.mbid}-${index}` : `${track.name}-${track.artist}-${index}`}
            >
              <Card
                title={track.name}
                subtitle={track.artist}
                images={track.image}
                onClick={() => window.open(track.url, '_blank', 'noopener,noreferrer')}
                onSubtitleClick={() => fetchArtistDetails(track.artist)}
              />
            </Box>
          ))}
      </Grid>
    </Box>
  );
};

export default SearchResults;
