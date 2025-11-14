import React from 'react';
import type { Track } from '../../utils/types';
import { FavouriteButton } from '../common/FavouriteButton';
import { Box, Flex, Stack, Text, Link } from '@chakra-ui/react';

interface TrackListProps {
  tracks: Track[];
  albumName: string;
}

const formatDuration = (secondsStr: string): string => {
  const seconds = parseInt(secondsStr, 10);
  if (isNaN(seconds) || seconds === 0) return '-';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const TrackList: React.FC<TrackListProps> = ({ tracks, albumName }) => {
  if (!tracks || tracks.length === 0) {
    return <Text color="gray.500">No track information available.</Text>;
  }
  return (
    <Box overflow="hidden" borderRadius="lg" bg="rgba(31, 41, 55, 0.5)" boxShadow="md">
      <Stack gap={0}>
        {tracks.map((track, index) => (
          <Box key={track['@attr'].rank}>
            {index > 0 && <Box borderColor="gray.700" borderTopWidth="1px" />}
            <Box
              p={4}
              _hover={{ bg: 'rgba(55, 65, 81, 0.5)' }}
              transition="colors"
              transitionDuration="200ms"
            >
              <Flex justify="space-between" align="center" gap={4}>
                <Flex align="center" flex="1" minW="0">
                  <Text
                    color="gray.500"
                    fontFamily="mono"
                    fontSize="sm"
                    w={8}
                    textAlign="center"
                    flexShrink={0}
                  >
                    {track['@attr'].rank}
                  </Text>
                  <Link
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    ml={4}
                    color="white"
                    _hover={{ color: 'pink.400' }}
                    fontWeight="medium"
                    transition="colors"
                    transitionDuration="200ms"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    title={track.name}
                  >
                    {track.name}
                  </Link>
                </Flex>
                <Flex align="center" flexShrink={0}>
                  <Text color="gray.400" fontSize="sm" fontFamily="mono" mr={4}>
                    {formatDuration(track.duration)}
                  </Text>
                  <FavouriteButton
                    track={{
                      id: `${track.artist}-${albumName}-${track.name}`,
                      name: track.name,
                      artist: track.artist,
                      albumName: albumName,
                      duration: track.duration,
                      url: track.url,
                    }}
                  />
                </Flex>
              </Flex>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
