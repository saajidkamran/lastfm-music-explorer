import React from 'react';
import type { Image } from '../../utils/types';
import { Box, Text, Image as ChakraImage } from '@chakra-ui/react';
import { cardStyles, textTruncateStyles } from '../../utils/styles';

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
        {...cardStyles.container}
        _hover={cardStyles.hover}
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
            {...cardStyles.imageOverlay}
            _groupHover={cardStyles.imageOverlayHover}
          />
        </Box>
        <Box p={4}>
          <Text
            {...cardStyles.title}
            {...textTruncateStyles}
            _groupHover={cardStyles.titleHover}
            title={title}
          >
            {title}
          </Text>
          <Text
            {...cardStyles.subtitle}
            {...textTruncateStyles}
            title={subtitle}
            onClick={onSubtitleClick ? handleSubtitleClick : undefined}
            cursor={onSubtitleClick ? 'pointer' : 'default'}
            _hover={onSubtitleClick ? cardStyles.subtitleHover : {}}
          >
            {subtitle}
          </Text>
        </Box>
      </Box>
    );
  }
);
