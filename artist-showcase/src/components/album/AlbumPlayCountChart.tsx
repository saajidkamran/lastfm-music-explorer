import React, { useMemo } from 'react';
import type { Track } from '../../utils/types';
import { Box, Flex, Text } from '@chakra-ui/react';

interface AlbumPlayCountChartProps {
  tracks: Track[];
}

const AlbumPlayCountChart: React.FC<AlbumPlayCountChartProps> = ({ tracks }) => {
  const chartData = useMemo(() => {
    return tracks
      .filter((track) => track.playcount && track.playcount > 0)
      .sort((a, b) => b.playcount! - a.playcount!)
      .slice(0, 15); // Show top 15 tracks
  }, [tracks]);

  if (chartData.length === 0) {
    return null;
  }

  const maxPlaycount = Math.max(...chartData.map((t) => t.playcount!));

  return (
    <Box bg="rgba(31, 41, 55, 0.5)" p={4} borderRadius="lg">
      <Flex align="flex-end" h={64} gap={2}>
        {chartData.map((track, index) => {
          const barHeight = (track.playcount! / maxPlaycount) * 100;
          return (
            <Box
              key={track['@attr'].rank}
              flex="1"
              h="100%"
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              title={`${track.name} - ${track.playcount!.toLocaleString()} plays`}
              _groupHover={{}}
            >
              <Box
                bg="pink.600"
                _hover={{ bg: 'pink.500' }}
                borderTopRadius="sm"
                transition="all"
                transitionDuration="300ms"
                style={{ height: `${barHeight}%` }}
              />
              <Text
                textAlign="center"
                fontSize="xs"
                color="gray.400"
                mt={1}
                isTruncated
                _groupHover={{ color: 'white' }}
              >
                {track['@attr'].rank}
              </Text>
            </Box>
          );
        })}
      </Flex>
      <Text textAlign="center" fontSize="xs" color="gray.500" mt={2}>
        Chart displays relative track popularity (simulated data). Bar numbers correspond to track
        rank.
      </Text>
    </Box>
  );
};

export default React.memo(AlbumPlayCountChart);
