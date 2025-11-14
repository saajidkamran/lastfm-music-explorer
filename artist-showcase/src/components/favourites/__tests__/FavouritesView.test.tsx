/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import FavouritesView from '../FavouritesView';
import { useMusicStore } from '../../../store/store';
import type { FavouriteTrack, FavouriteAlbum } from '../../../utils/types';

// Mock the store
vi.mock('../../../store/store', () => ({
  useMusicStore: vi.fn(),
}));

// Mock child components
vi.mock('../../common/FavouriteButton', () => ({
  FavouriteButton: ({ track }: any) => (
    <div data-testid={`favourite-track-${track.id}`}>Favourite</div>
  ),
}));

vi.mock('../../common/Card', () => ({
  Card: ({ title, onClick }: any) => (
    <div onClick={onClick} data-testid={`card-${title}`}>
      {title}
    </div>
  ),
}));

vi.mock('../../common/FavouriteAlbumButton', () => ({
  FavouriteAlbumButton: () => <div data-testid="favourite-album-button">Favourite</div>,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{component}</ChakraProvider>);
};

const mockFavouriteTracks: FavouriteTrack[] = [
  {
    id: 'artist1-album1-track1',
    name: 'Track 1',
    artist: 'Artist 1',
    albumName: 'Album 1',
    duration: '180',
    url: 'https://example.com/track1',
    dateAdded: Date.now() - 1000,
  },
  {
    id: 'artist2-album2-track2',
    name: 'Track 2',
    artist: 'Artist 2',
    albumName: 'Album 2',
    duration: '240',
    url: 'https://example.com/track2',
    dateAdded: Date.now(),
  },
];

const mockFavouriteAlbums: FavouriteAlbum[] = [
  {
    id: 'artist1-album1',
    name: 'Album 1',
    artist: 'Artist 1',
    image: [],
    dateAdded: Date.now() - 1000,
  },
  {
    id: 'artist2-album2',
    name: 'Album 2',
    artist: 'Artist 2',
    image: [],
    dateAdded: Date.now(),
  },
];

describe('FavouritesView', () => {
  const mockFetchAlbumDetails = vi.fn();
  const mockSetFavouritesSort = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no favourites', () => {
    (useMusicStore as any).mockReturnValue({
      favourites: [],
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    expect(screen.getByText(/no favourites yet/i)).toBeInTheDocument();
  });

  it('renders tracks tab by default', () => {
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
  });

  it('switches to albums tab when clicked', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: [],
      favouriteAlbums: mockFavouriteAlbums,
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const albumsTab = screen.getByRole('button', { name: /albums/i });
    await user.click(albumsTab);
    expect(screen.getByTestId('card-Album 1')).toBeInTheDocument();
    expect(screen.getByTestId('card-Album 2')).toBeInTheDocument();
  });

  it('filters tracks by search term', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const filterInput = screen.getByPlaceholderText(/filter tracks/i);
    await user.type(filterInput, 'Track 1');
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.queryByText('Track 2')).not.toBeInTheDocument();
  });

  it('filters albums by search term', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: [],
      favouriteAlbums: mockFavouriteAlbums,
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const albumsTab = screen.getByRole('button', { name: /albums/i });
    await user.click(albumsTab);
    const filterInput = screen.getByPlaceholderText(/filter albums/i);
    await user.type(filterInput, 'Album 1');
    expect(screen.getByTestId('card-Album 1')).toBeInTheDocument();
    expect(screen.queryByTestId('card-Album 2')).not.toBeInTheDocument();
  });

  it('sorts tracks by date descending', () => {
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const tracks = screen.getAllByText(/Track \d/);
    // Track 2 (newer) should come first
    expect(tracks[0]).toHaveTextContent('Track 2');
    expect(tracks[1]).toHaveTextContent('Track 1');
  });

  it('calls setFavouritesSort when sort option changes', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const sortSelect = screen.getByDisplayValue(/recently added/i);
    await user.selectOptions(sortSelect, 'name_asc');
    expect(mockSetFavouritesSort).toHaveBeenCalledWith('name_asc');
  });

  it('calls fetchAlbumDetails when track name is clicked', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const trackName = screen.getByText('Track 1');
    await user.click(trackName);
    expect(mockFetchAlbumDetails).toHaveBeenCalledWith('Artist 1', 'Album 1');
  });

  it('displays track count in tab button', () => {
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    expect(screen.getByText(/tracks \(2\)/i)).toBeInTheDocument();
  });

  it('displays album count in tab button', () => {
    (useMusicStore as any).mockReturnValue({
      favourites: [],
      favouriteAlbums: mockFavouriteAlbums,
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    expect(screen.getByText(/albums \(2\)/i)).toBeInTheDocument();
  });

  it('shows no matches message when filter has no results', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      favourites: mockFavouriteTracks,
      favouriteAlbums: [],
      fetchAlbumDetails: mockFetchAlbumDetails,
      favouritesSort: 'date_desc' as const,
      setFavouritesSort: mockSetFavouritesSort,
    });
    renderWithProvider(<FavouritesView />);
    const filterInput = screen.getByPlaceholderText(/filter tracks/i);
    await user.type(filterInput, 'NonExistentTrack');
    expect(screen.getByText(/no favourite tracks match your filter/i)).toBeInTheDocument();
  });
});
