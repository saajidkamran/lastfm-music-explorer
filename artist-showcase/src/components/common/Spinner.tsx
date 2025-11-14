
import React from 'react';
import { Flex, Spinner as ChakraSpinner, Text } from '@chakra-ui/react';

export const Spinner: React.FC = () => (
  <Flex justify="center" align="center" p={8}>
    <ChakraSpinner 
      size="xl"
      color="pink.500"
      mr={3}
      borderWidth="4px"
    />
    <Text fontSize="lg" color="gray.400">Loading...</Text>
  </Flex>
);
