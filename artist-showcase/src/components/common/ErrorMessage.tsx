
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <Box
    bg="rgba(127, 29, 29, 0.5)"
    border="1px"
    borderColor="red.700"
    color="red.300"
    px={4}
    py={3}
    borderRadius="lg"
    position="relative"
    textAlign="center"
    role="alert"
  >
    <Text as="strong" fontWeight="bold">Error: </Text>
    <Text as="span" display={{ base: 'block', sm: 'inline' }}>{message}</Text>
  </Box>
);
