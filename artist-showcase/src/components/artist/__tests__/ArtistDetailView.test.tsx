import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import ArtistDetailView from '../ArtistDetailView';
import { useMusicStore } from '../../../store/store';
import type { AlbumDetail } from '../../../utils/types';

// Mock the store
vi.mock('../../../store/store', () => ({
  useMusicStore: vi.fn(),
}));

// Mock Card component
vi.mock('../../common/Card', () => ({
  Card: ({ title, onClick }: any) => (
    <div onClick={onClick} data-testid={`card-${title}`}>
      {title}
    </div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{component}</ChakraProvider>);
};

const mockAlbums: AlbumDetail[] = [
  {
    name: 'Album A',
    artist: 'Test Artist',
    url: 'https://example.com/album-a',
    image: [],
    listeners: '1000',
    playcount: '5000',
    year: '2020',
    tracks: { track: [] },
    tags: { tag: [] },
  },
  {
    name: 'Album B',
    artist: 'Test Artist',
    url: 'https://example.com/album-b',
    image: [],
    listeners: '2000',
    playcount: '10000',
    year: '2021',
    tracks: { track: [] },
    tags: { tag: [] },
  },
];

describe('ArtistDetailView', () => {
  const mockFetchAlbumDetails = vi.fn();
  const mockSetArtistSortOption = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when loading', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: null,
      artistAlbums: [],
      loading: true,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: null,
      artistAlbums: [],
      loading: false,
      error: 'Failed to load artist',
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    expect(screen.getByText(/error:/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to load artist')).toBeInTheDocument();
  });

  it('returns null when no artist selected', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: null,
      artistAlbums: [],
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    const { container } = renderWithProvider(<ArtistDetailView />);
    expect(container.firstChild).toBeNull();
  });

  it('renders artist name and albums', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: mockAlbums,
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Top Albums')).toBeInTheDocument();
  });

  it('renders album cards', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: mockAlbums,
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    expect(screen.getByTestId('card-Album A')).toBeInTheDocument();
    expect(screen.getByTestId('card-Album B')).toBeInTheDocument();
  });

  it('renders no albums message when no albums', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: [],
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    expect(screen.getByText(/no albums found for this artist/i)).toBeInTheDocument();
  });

  it('calls fetchAlbumDetails when album card is clicked', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: mockAlbums,
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    const card = screen.getByTestId('card-Album A');
    await user.click(card);
    expect(mockFetchAlbumDetails).toHaveBeenCalledWith('Test Artist', 'Album A');
  });

  it('calls setArtistSortOption when sort option changes', async () => {
    const user = userEvent.setup();
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: mockAlbums,
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    const sortSelect = screen.getByLabelText(/sort albums by/i);
    await user.selectOptions(sortSelect, 'name_asc');
    expect(mockSetArtistSortOption).toHaveBeenCalledWith('name_asc');
  });

  it('sorts albums by release year descending', () => {
    (useMusicStore as any).mockReturnValue({
      selectedArtist: { name: 'Test Artist' },
      artistAlbums: mockAlbums,
      loading: false,
      error: null,
      artistSortOption: 'release_desc' as const,
      setArtistSortOption: mockSetArtistSortOption,
      fetchAlbumDetails: mockFetchAlbumDetails,
    });
    renderWithProvider(<ArtistDetailView />);
    const cards = screen.getAllByTestId(/^card-/);
    // Album B (2021) should come before Album A (2020)
    expect(cards[0]).toHaveTextContent('Album B');
    expect(cards[1]).toHaveTextContent('Album A');
  });
});



