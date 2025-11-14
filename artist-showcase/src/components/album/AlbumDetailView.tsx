import React, { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useMusicStore } from '../../store/store';
import { Spinner } from '../common/Spinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { TrackList } from './TrackList';
import type { Image, TrackSortOption } from '../../utils/types';
import { FavouriteAlbumButton } from '../common/FavouriteAlbumButton';
import { Box, Flex, Text, Image as ChakraImage, VisuallyHidden, Badge } from '@chakra-ui/react';

const findImageUrl = (images: Image[]): string => {
  const extraLargeImage = images.find((img) => img.size === 'extralarge' && img['#text']);
  if (extraLargeImage) return extraLargeImage['#text'];
  const largeImage = images.find((img) => img.size === 'large' && img['#text']);
  if (largeImage) return largeImage['#text'];
  return process.env.DEFAULT_ART_IMAGE || '';
};

const AlbumDetailView: React.FC = () => {
  const { selectedAlbum, loading, error, fetchArtistDetails, trackSortOption, setTrackSortOption } =
    useMusicStore();

  const sortedTracks = useMemo(() => {
    if (!selectedAlbum?.tracks?.track) return [];
    const tracksToSort = [...selectedAlbum.tracks.track];
    switch (trackSortOption) {
      case 'rank_asc':
        return tracksToSort.sort((a, b) => a['@attr'].rank - b['@attr'].rank);
      case 'name_asc':
        return tracksToSort.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return tracksToSort.sort((a, b) => b.name.localeCompare(a.name));
      case 'duration_asc':
        return tracksToSort.sort(
          (a, b) => (parseInt(a.duration, 10) || 0) - (parseInt(b.duration, 10) || 0)
        );
      case 'duration_desc':
        return tracksToSort.sort(
          (a, b) => (parseInt(b.duration, 10) || 0) - (parseInt(a.duration, 10) || 0)
        );
      case 'playcount_asc':
        return tracksToSort.sort((a, b) => (a.playcount || 0) - (b.playcount || 0));
      case 'playcount_desc':
        return tracksToSort.sort((a, b) => (b.playcount || 0) - (a.playcount || 0));
      default:
        return tracksToSort.sort((a, b) => a['@attr'].rank - b['@attr'].rank);
    }
  }, [selectedAlbum, trackSortOption]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedAlbum) return null;

  const imageUrl = findImageUrl(selectedAlbum.image);
  const summary = selectedAlbum.wiki?.summary?.split('<a href')[0]; // Remove "Read more on Last.fm" link

  return (
    <Flex flexDirection={{ base: 'column', md: 'row' }} gap={8}>
      <Box w={{ md: '33.333333%' }} flexShrink={0}>
        <ChakraImage
          src={imageUrl}
          alt={selectedAlbum.name}
          w="100%"
          aspectRatio={1}
          objectFit="cover"
          borderRadius="xl"
          boxShadow="2xl"
          shadowColor="rgba(0, 0, 0, 0.3)"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = process.env.DEFAULT_ART_IMAGE || '')}
        />
        <Flex
          mt={4}
          justify="space-around"
          textAlign="center"
          fontSize="sm"
          bg="rgba(31, 41, 55, 0.5)"
          p={3}
          borderRadius="lg"
        >
          <Box>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">
              {Number(selectedAlbum.listeners).toLocaleString()}
            </Text>
            <Text color="gray.400">Listeners</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">
              {Number(selectedAlbum.playcount).toLocaleString()}
            </Text>
            <Text color="gray.400">Playcount</Text>
          </Box>
        </Flex>
      </Box>
      <Box w={{ md: '66.666667%' }}>
        <Flex align="flex-start" justify="space-between" gap={4}>
          <Box flex="1">
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="extrabold" color="white">
              {selectedAlbum.name}
            </Text>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              color="gray.400"
              mt={1}
              _hover={{ color: 'pink.400', textDecoration: 'underline' }}
              cursor="pointer"
              transition="colors"
              onClick={() => fetchArtistDetails(selectedAlbum.artist)}
              title={`More from ${selectedAlbum.artist}`}
            >
              {selectedAlbum.artist}
            </Text>
          </Box>
          <Box flexShrink={0} mt={2}>
            <FavouriteAlbumButton album={selectedAlbum} />
          </Box>
        </Flex>

        {selectedAlbum.tags.tag.length > 0 && (
          <Flex mt={4} flexWrap="wrap" gap={2}>
            {selectedAlbum.tags.tag.map((tag) => (
              <Badge
                key={tag.name}
                bg="gray.700"
                color="pink.300"
                fontSize="xs"
                fontWeight="semibold"
                px={2.5}
                py={1}
                borderRadius="full"
              >
                {tag.name}
              </Badge>
            ))}
          </Flex>
        )}

        {summary && (
          <Text
            mt={6}
            color="gray.300"
            lineHeight="relaxed"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        )}

        <Box mt={8}>
          <Flex
            flexDirection={{ base: 'column', sm: 'row' }}
            justify={{ sm: 'space-between' }}
            align={{ sm: 'center' }}
            gap={2}
            mb={4}
            borderBottom="2px"
            borderColor="gray.700"
            pb={2}
          >
            <Text fontSize="2xl" fontWeight="bold" color="gray.300">
              Tracklist
            </Text>
            <Box flexShrink={0}>
              <VisuallyHidden>
                <label htmlFor="track-sort-select">Sort tracks by</label>
              </VisuallyHidden>
              <select
                id="track-sort-select"
                value={trackSortOption}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTrackSortOption(e.target.value as TrackSortOption)}
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
                <option value="rank_asc">Track Number</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
                <option value="duration_desc">Duration: Longest</option>
                <option value="duration_asc">Duration: Shortest</option>
                <option value="playcount_desc">Most Popular</option>
                <option value="playcount_asc">Least Popular</option>
              </select>
            </Box>
          </Flex>
          <TrackList tracks={sortedTracks} />
        </Box>
      </Box>
    </Flex>
  );
};

export default AlbumDetailView;
