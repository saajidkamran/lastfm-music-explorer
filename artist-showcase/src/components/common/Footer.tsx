import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export const Footer: React.FC = () => {
  return (
    <Box as="footer" textAlign="center" py={4} color="gray.500" fontSize="sm">
      <Text>Powered by Last.fm API</Text>
    </Box>
  );
};
