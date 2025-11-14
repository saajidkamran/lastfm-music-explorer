import React, { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useMusicStore } from '../../store/store';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import { ErrorMessage } from '../common/ErrorMessage';
import type { ArtistSortOption } from '../../utils/types';
import { Box, Flex, Text, Grid, VisuallyHidden } from '@chakra-ui/react';
import { selectStyles } from '../../utils/styles';

const ArtistDetailView: React.FC = () => {
  const {
    selectedArtist,
    artistAlbums,
    loading,
    error,
    artistSortOption,
    setArtistSortOption,
    fetchAlbumDetails,
  } = useMusicStore();

  const sortedAlbums = useMemo(() => {
    const sorted = [...artistAlbums];
    switch (artistSortOption) {
      case 'release_desc':
        return sorted.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
      case 'release_asc':
        return sorted.sort((a, b) => (a.year || '9999').localeCompare(b.year || '9999'));
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [artistAlbums, artistSortOption]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedArtist) return null;

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
        pb={4}
      >
        <Box>
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="extrabold" color="white">{selectedArtist.name}</Text>
            <Text color="gray.400" mt={1}>Top Albums</Text>
        </Box>
        <Box>
            <VisuallyHidden>
              <label htmlFor="sort-select">Sort albums by</label>
            </VisuallyHidden>
            <select
                id="sort-select"
                value={artistSortOption}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setArtistSortOption(e.target.value as ArtistSortOption)
                }
                style={selectStyles.base}
                onFocus={(e) => {
                  e.target.style.borderColor = selectStyles.focus.borderColor;
                  e.target.style.boxShadow = selectStyles.focus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = selectStyles.blur.borderColor;
                }}
            >
                <option value="release_desc">Year: Newest First</option>
                <option value="release_asc">Year: Oldest First</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
            </select>
        </Box>
      </Flex>

      {sortedAlbums.length > 0 ? (
        <Grid
          templateColumns={{
            base: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
            xl: 'repeat(6, 1fr)'
          }}
          gap={{ base: 4, md: 6 }}
        >
          {sortedAlbums.map((album) => (
            <Card
              key={album.mbid ? `${album.mbid}-${album.name}` : `${album.name}-${album.artist}`}
              title={album.name}
              subtitle={album.year || 'Year Unknown'}
              images={album.image}
              onClick={() => fetchAlbumDetails(album.artist, album.name)}
            />
          ))}
        </Grid>
      ) : (
        <Text textAlign="center" color="gray.400" mt={8}>No albums found for this artist.</Text>
      )}
    </Box>
  );
};

export default ArtistDetailView;