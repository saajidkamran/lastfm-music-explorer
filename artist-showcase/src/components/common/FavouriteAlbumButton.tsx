import React from 'react';
import { useMusicStore } from '../../store/store';
// Fix: Import AlbumIdentifier instead of FavouriteAlbum.
import type { AlbumDetail, AlbumSearchResult, AlbumIdentifier } from '../../utils/types';
import { IconButton, Box } from '@chakra-ui/react';

interface FavouriteAlbumButtonProps {
  // Fix: Add AlbumIdentifier to the union type to allow passing FavouriteAlbum objects,
  // which are used in the FavouritesView and are assignable to AlbumIdentifier.
  album: AlbumDetail | AlbumSearchResult | AlbumIdentifier;
}

export const FavouriteAlbumButton: React.FC<FavouriteAlbumButtonProps> = ({ album }) => {
  const { addFavouriteAlbum, removeFavouriteAlbum, isFavouriteAlbum } = useMusicStore();
  
  const albumId = `${album.artist}-${album.name}`;
  const isFav = isFavouriteAlbum(albumId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks or other parent element events
    // Fix: The created object is an `AlbumIdentifier`. `dateAdded` is added in the store.
    const favAlbum: AlbumIdentifier = {
        id: albumId,
        name: album.name,
        artist: album.artist,
        image: album.image,
        mbid: album.mbid,
    }
    if (isFav) {
      removeFavouriteAlbum(albumId);
    } else {
      addFavouriteAlbum(favAlbum);
    }
  };

  return (
    <IconButton
      onClick={handleToggle}
      borderRadius="full"
      p={2}
      transition="colors"
      transitionDuration="200ms"
      bg="rgba(17, 24, 39, 0.5)"
      backdropFilter="blur(4px)"
      color={isFav ? 'pink.500' : 'gray.300'}
      _hover={{
        color: 'pink.400',
        bg: isFav ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
      }}
      aria-label={isFav ? 'Remove album from favourites' : 'Add album to favourites'}
      title={isFav ? 'Remove album from favourites' : 'Add album to favourites'}
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
