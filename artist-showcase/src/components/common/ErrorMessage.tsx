import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { errorMessageStyles } from '../../utils/styles';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <Box {...errorMessageStyles.container}>
    <Text as="strong" fontWeight="bold">
      Error:{' '}
    </Text>
    <Text as="span" display={{ base: 'block', sm: 'inline' }}>
      {message}
    </Text>
  </Box>
);
