/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import AlbumDetailView from '../AlbumDetailView';
import { useMusicStore } from '../../../store/store';
import type { AlbumDetail } from '../../../utils/types';

// Mock the store
vi.mock('../../../store/store', () => ({
  useMusicStore: vi.fn(),
}));

// Mock child components
vi.mock('../TrackList', () => ({
  TrackList: ({ tracks }: any) => (
    <div data-testid="track-list">
      {tracks.map((t: any) => (
        <div key={t['@attr'].rank}>{t.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../AlbumPlayCountChart', () => ({
  default: ({ tracks }: any) => (
    <div data-testid="play-count-chart">
      Chart for {tracks.length} tracks
    </div>
  ),
}));

vi.mock('../../common/FavouriteAlbumButton', () => ({
  FavouriteAlbumButton: () => <div data-testid="favourite-button">Favourite</div>,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{component}</ChakraProvider>);
};

const mockAlbum: AlbumDetail = {
  name: 'Test Album',
  artist: 'Test Artist',
  url: 'https://example.com/album',
  image: [],
  listeners: '10000',
  playcount: '50000',
  tracks: {
    track: [
      {
        name: 'Track 1',
        duration: '180',
        url: 'https://example.com/track1',
        artist: 'Test Artist',
        '@attr': { rank: 1 },
        playcount: 1000,
      },
      {
        name: 'Track 2',
        duration: '240',
        url: 'https://example.com/track2',
        artist: 'Test Artist',
        '@attr': { rank: 2 },
        playcount: 500,
      },
    ],
  },
  tags: {
    tag: [
      { name: 'Electronic', url: 'https://example.com/tag/electronic' },
      { name: 'Dance', url: 'https://example.com/tag/dance' },
    ],
  },
  wiki: {
    published: '25 Mar 2013, 15:47',
    summary: 'This is a test album summary.',
    content: 'Full content here',
  },
};

describe('AlbumDetailView', () => {
  const mockFetchArtistDetails = vi.fn();
  const mockSetTrackSortOption = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when loading', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: null,
      loading: true,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: null,
      loading: false,
      error: 'Failed to load album',
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByText(/error:/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to load album')).toBeInTheDocument();
  });

  it('returns null when no album selected', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: null,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    const { container } = renderWithProvider(<AlbumDetailView />);
    expect(container.firstChild).toBeNull();
  });

  it('renders album details', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('displays listeners and playcount', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByText('10,000')).toBeInTheDocument(); // listeners
    expect(screen.getByText('50,000')).toBeInTheDocument(); // playcount
  });

  it('renders tags', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByText('Electronic')).toBeInTheDocument();
    expect(screen.getByText('Dance')).toBeInTheDocument();
  });

  it('renders track list', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByTestId('track-list')).toBeInTheDocument();
  });

  it('renders play count chart', () => {
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    expect(screen.getByTestId('play-count-chart')).toBeInTheDocument();
  });

  it('calls fetchArtistDetails when artist name is clicked', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    const artistLink = screen.getByText('Test Artist');
    await user.click(artistLink);
    expect(mockFetchArtistDetails).toHaveBeenCalledWith('Test Artist');
  });

  it('calls setTrackSortOption when sort option changes', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      selectedAlbum: mockAlbum,
      loading: false,
      error: null,
      trackSortOption: 'rank_asc' as const,
      setTrackSortOption: mockSetTrackSortOption,
      fetchArtistDetails: mockFetchArtistDetails,
    });
    renderWithProvider(<AlbumDetailView />);
    const sortSelect = screen.getByLabelText(/sort tracks by/i);
    await user.selectOptions(sortSelect, 'name_asc');
    expect(mockSetTrackSortOption).toHaveBeenCalledWith('name_asc');
  });
});



