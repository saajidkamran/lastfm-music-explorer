import React from 'react';
import type { Image } from '../../utils/types';
import { Box, Text, Image as ChakraImage } from '@chakra-ui/react';

interface CardProps {
  title: string;
  subtitle: string;
  images: Image[];
  onClick: () => void;
  onSubtitleClick?: () => void;
}

const findImageUrl = (images: Image[]): string => {
  const largeImage = images.find((img) => img.size === 'large' && img['#text']);
  if (largeImage) return largeImage['#text'];
  const mediumImage = images.find((img) => img.size === 'medium' && img['#text']);
  if (mediumImage) return mediumImage['#text'];
  return import.meta.env.VITE_DEFAULT_ART_IMAGE || '';
};

export const Card: React.FC<CardProps> = React.memo(
  ({ title, subtitle, images, onClick, onSubtitleClick }) => {
    const imageUrl = findImageUrl(images);

    const handleSubtitleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSubtitleClick?.();
    };

    return (
      <Box
        onClick={onClick}
        bg="gray.800"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        transform="auto"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '2xl',
          shadowColor: 'rgba(236, 72, 153, 0.1)',
        }}
        transition="all"
        transitionDuration="300ms"
        cursor="pointer"
      >
        <Box position="relative" aspectRatio={1}>
          <ChakraImage
            src={imageUrl}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform"
            transitionDuration="300ms"
            _groupHover={{ transform: 'scale(1.05)' }}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = import.meta.env.VITE_DEFAULT_ART_IMAGE || '')}
          />
          <Box
            position="absolute"
            inset={0}
            bg="rgba(0, 0, 0, 0.4)"
            _groupHover={{ bg: 'rgba(0, 0, 0, 0.2)' }}
            transition="all"
            transitionDuration="300ms"
          />
        </Box>
        <Box p={4}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color="white"
            _groupHover={{ color: 'pink.400' }}
            transition="colors"
            transitionDuration="200ms"
            title={title}
          >
            {title}
          </Text>
          <Text
            fontSize="xs"
            color="gray.400"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            title={subtitle}
            onClick={onSubtitleClick ? handleSubtitleClick : undefined}
            cursor={onSubtitleClick ? 'pointer' : 'default'}
            _hover={onSubtitleClick ? { color: 'pink.400', textDecoration: 'underline' } : {}}
          >
            {subtitle}
          </Text>
        </Box>
      </Box>
    );
  }
);
