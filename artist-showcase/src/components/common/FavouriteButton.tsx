import React from 'react';
import { useMusicStore } from '../../store/store';
import type { TrackIdentifier } from '../../utils/types';
import { IconButton, Box } from '@chakra-ui/react';

interface FavouriteButtonProps {
  track: TrackIdentifier;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({ track }) => {
  const { addFavourite, removeFavourite, isFavourite } = useMusicStore();
  const isFav = isFavourite(track.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks or link navigation
    if (isFav) {
      removeFavourite(track.id);
    } else {
      addFavourite(track);
    }
  };

  return (
    <IconButton
      onClick={handleToggle}
      borderRadius="full"
      p={2}
      transition="colors"
      transitionDuration="200ms"
      color={isFav ? 'pink.500' : 'gray.500'}
      _hover={{
        color: 'pink.500',
        bg: 'rgba(236, 72, 153, 0.1)'
      }}
      aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      variant="ghost"
      size="sm"
    >
      <Box position="relative" w={5} h={5}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            position: 'absolute',
            transition: 'all 300ms',
            opacity: isFav ? 1 : 0,
          }}
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          style={{
            position: 'absolute',
            transition: 'all 300ms',
            opacity: isFav ? 0 : 1,
          }}
        >
          <path
            d="M10 4.343l-1.172-1.171a4 4 0 00-5.656 5.656L10 17.657l6.828-6.829a4 4 0 00-5.656-5.656L10 4.343z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </Box>
    </IconButton>
  );
};