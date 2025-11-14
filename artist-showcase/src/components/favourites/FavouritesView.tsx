import React, { useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useMusicStore } from '../../store/store';
import { FavouriteButton } from '../common/FavouriteButton';
import { Card } from '../common/Card';
import { FavouriteAlbumButton } from '../common/FavouriteAlbumButton';
import type { FavouritesSortOption } from '../../utils/types';
import { Box, Flex, Text, Button, Input, Grid, Stack, VisuallyHidden } from '@chakra-ui/react';
import {
  selectStyles,
  searchBarStyles,
  favouritesViewStyles,
  textTruncateStyles,
  svgIconStyles,
} from '../../utils/styles';

const FavouritesView: React.FC = () => {
  const { favourites, favouriteAlbums, fetchAlbumDetails, favouritesSort, setFavouritesSort } =
    useMusicStore();
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums'>('tracks');

  const filteredFavourites = useMemo(() => {
    if (!filter) return favourites;
    return favourites.filter(
      (fav) =>
        fav.name.toLowerCase().includes(filter.toLowerCase()) ||
        fav.artist.toLowerCase().includes(filter.toLowerCase()) ||
        fav.albumName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [favourites, filter]);

  const sortedFavourites = useMemo(() => {
    const sorted = [...filteredFavourites];
    switch (favouritesSort) {
      case 'date_desc':
        return sorted.sort((a, b) => b.dateAdded - a.dateAdded);
      case 'date_asc':
        return sorted.sort((a, b) => a.dateAdded - b.dateAdded);
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'artist_asc':
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'artist_desc':
        return sorted.sort((a, b) => b.artist.localeCompare(a.artist));
      case 'album_asc':
        return sorted.sort((a, b) => a.albumName.localeCompare(b.albumName));
      case 'album_desc':
        return sorted.sort((a, b) => b.albumName.localeCompare(a.albumName));
      default:
        return sorted;
    }
  }, [filteredFavourites, favouritesSort]);

  const filteredFavouriteAlbums = useMemo(() => {
    if (!filter) return favouriteAlbums;
    return favouriteAlbums.filter(
      (fav) =>
        fav.name.toLowerCase().includes(filter.toLowerCase()) ||
        fav.artist.toLowerCase().includes(filter.toLowerCase())
    );
  }, [favouriteAlbums, filter]);

  const sortedFavouriteAlbums = useMemo(() => {
    const sorted = [...filteredFavouriteAlbums];
    switch (favouritesSort) {
      case 'date_desc':
        return sorted.sort((a, b) => b.dateAdded - a.dateAdded);
      case 'date_asc':
        return sorted.sort((a, b) => a.dateAdded - b.dateAdded);
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'artist_asc':
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'artist_desc':
        return sorted.sort((a, b) => b.artist.localeCompare(a.artist));
      default:
        return sorted;
    }
  }, [filteredFavouriteAlbums, favouritesSort]);

  const formatDuration = (secondsStr: string): string => {
    const seconds = parseInt(secondsStr, 10);
    if (isNaN(seconds) || seconds === 0) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTabChange = (tab: 'tracks' | 'albums') => {
    setActiveTab(tab);
    setFilter('');
    // If current sort is invalid for new tab, reset to default
    const isAlbumSpecificSort = favouritesSort === 'album_asc' || favouritesSort === 'album_desc';
    if (tab === 'albums' && isAlbumSpecificSort) {
      setFavouritesSort('date_desc');
    }
  };

  if (favourites.length === 0 && favouriteAlbums.length === 0) {
    return (
      <Box {...favouritesViewStyles.emptyState}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={svgIconStyles.emptyStateIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <Text {...favouritesViewStyles.emptyStateTitle}>No Favourites Yet</Text>
        <Text {...favouritesViewStyles.emptyStateText}>
          Add songs or albums to your favourites to see them here.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text {...favouritesViewStyles.title}>My Favourites</Text>

      <Flex {...searchBarStyles.typeSelectorContainer} mb={6}>
        <Button
          onClick={() => handleTabChange('tracks')}
          {...searchBarStyles.typeButton}
          {...(activeTab === 'tracks'
            ? searchBarStyles.typeButtonActive
            : searchBarStyles.typeButtonInactive)}
          _hover={
            activeTab === 'tracks'
              ? searchBarStyles.typeButtonActive
              : searchBarStyles.typeButtonHover
          }
        >
          Tracks ({favourites.length})
        </Button>
        <Button
          onClick={() => handleTabChange('albums')}
          {...searchBarStyles.typeButton}
          {...(activeTab === 'albums'
            ? searchBarStyles.typeButtonActive
            : searchBarStyles.typeButtonInactive)}
          _hover={
            activeTab === 'albums'
              ? searchBarStyles.typeButtonActive
              : searchBarStyles.typeButtonHover
          }
        >
          Albums ({favouriteAlbums.length})
        </Button>
      </Flex>

      <Flex mb={6} flexDirection={{ base: 'column', sm: 'row' }} gap={4}>
        <Input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`Filter ${activeTab}...`}
          {...searchBarStyles.input}
          _placeholder={searchBarStyles.inputPlaceholder}
          _focus={searchBarStyles.inputFocus}
        />
        <Box>
          <VisuallyHidden>
            <label htmlFor="favourites-sort-select">Sort favourites by</label>
          </VisuallyHidden>
          <select
            id="favourites-sort-select"
            value={favouritesSort}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFavouritesSort(e.target.value as FavouritesSortOption)
            }
            style={selectStyles.base}
            onFocus={(e) => {
              e.target.style.borderColor = selectStyles.focus.borderColor;
              e.target.style.boxShadow = selectStyles.focus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = selectStyles.blur.borderColor;
            }}
          >
          <option value="date_desc">Recently Added</option>
          <option value="date_asc">Oldest Added</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
          <option value="artist_asc">Artist: A-Z</option>
          <option value="artist_desc">Artist: Z-A</option>
          {activeTab === 'tracks' && (
            <>
              <option value="album_asc">Album: A-Z</option>
              <option value="album_desc">Album: Z-A</option>
            </>
          )}
          </select>
        </Box>
      </Flex>

      {activeTab === 'tracks' && (
        <>
          {favourites.length > 0 ? (
            <Box {...favouritesViewStyles.trackListContainer}>
              <Stack gap={0}>
                {sortedFavourites.map((fav, index) => (
                  <Box key={fav.id}>
                    {index > 0 && <Box borderColor="gray.700" borderTopWidth="1px" />}
                    <Box
                      {...favouritesViewStyles.trackListItem}
                      _hover={favouritesViewStyles.trackListItemHover}
                    >
                      <Flex justify="space-between" align="center" gap={4}>
                        <Box flex="1" minW="0">
                          <Text
                            onClick={() => fetchAlbumDetails(fav.artist, fav.albumName)}
                            {...favouritesViewStyles.trackName}
                            {...textTruncateStyles}
                            _hover={favouritesViewStyles.trackNameHover}
                            title={fav.name}
                          >
                            {fav.name}
                          </Text>
                          <Text
                            {...favouritesViewStyles.trackInfo}
                            {...textTruncateStyles}
                            title={`${fav.artist} - ${fav.albumName}`}
                          >
                            {fav.artist} &ndash;{' '}
                            <Text as="span" color="gray.500">
                              {fav.albumName}
                            </Text>
                          </Text>
                        </Box>
                        <Flex align="center" flexShrink={0}>
                          <Text {...favouritesViewStyles.trackDuration}>
                            {formatDuration(fav.duration)}
                          </Text>
                          <FavouriteButton track={fav} />
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Text {...favouritesViewStyles.emptyMessage}>You have no favourite tracks.</Text>
          )}
          {sortedFavourites.length === 0 && favourites.length > 0 && (
            <Text {...favouritesViewStyles.emptyMessage}>
              No favourite tracks match your filter.
            </Text>
          )}
        </>
      )}

      {activeTab === 'albums' && (
        <>
          {favouriteAlbums.length > 0 ? (
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              }}
              gap={{ base: 4, md: 6 }}
            >
              {sortedFavouriteAlbums.map((album) => (
                <Box key={album.id} position="relative">
                  <Card
                    title={album.name}
                    subtitle={album.artist}
                    images={album.image}
                    onClick={() => fetchAlbumDetails(album.artist, album.name)}
                  />
                  <Box
                    {...favouritesViewStyles.favouriteButtonContainer}
                    _groupHover={favouritesViewStyles.favouriteButtonContainerHover}
                  >
                    <FavouriteAlbumButton album={album} />
                  </Box>
                </Box>
              ))}
            </Grid>
          ) : (
            <Text {...favouritesViewStyles.emptyMessage}>You have no favourite albums.</Text>
          )}
          {sortedFavouriteAlbums.length === 0 && favouriteAlbums.length > 0 && (
            <Text {...favouritesViewStyles.emptyMessage}>
              No favourite albums match your filter.
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default FavouritesView;
