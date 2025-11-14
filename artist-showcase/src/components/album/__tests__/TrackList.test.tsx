/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { TrackList } from '../TrackList';
import type { Track } from '../../../utils/types';

// Mock FavouriteButton
vi.mock('../../common/FavouriteButton', () => ({
  FavouriteButton: ({ track }: any) => (
    <div data-testid={`favourite-${track.id}`}>Favourite</div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{component}</ChakraProvider>);
};

const mockTracks: Track[] = [
  {
    name: 'Track 1',
    duration: '180',
    url: 'https://example.com/track1',
    artist: 'Artist A',
    '@attr': { rank: 1 },
    playcount: 100,
  },
  {
    name: 'Track 2',
    duration: '240',
    url: 'https://example.com/track2',
    artist: 'Artist A',
    '@attr': { rank: 2 },
    playcount: 200,
  },
];

describe('TrackList', () => {
  it('renders track list', () => {
    renderWithProvider(<TrackList tracks={mockTracks} albumName="Test Album" />);
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
  });

  it('displays track numbers', () => {
    renderWithProvider(<TrackList tracks={mockTracks} albumName="Test Album" />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    renderWithProvider(<TrackList tracks={mockTracks} albumName="Test Album" />);
    expect(screen.getByText('3:00')).toBeInTheDocument(); // 180 seconds
    expect(screen.getByText('4:00')).toBeInTheDocument(); // 240 seconds
  });

  it('displays "-" for zero duration', () => {
    const tracksWithZero: Track[] = [
      {
        name: 'Track 1',
        duration: '0',
        url: 'https://example.com/track1',
        artist: 'Artist A',
        '@attr': { rank: 1 },
      },
    ];
    renderWithProvider(<TrackList tracks={tracksWithZero} albumName="Test Album" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders no tracks message when tracks array is empty', () => {
    renderWithProvider(<TrackList tracks={[]} albumName="Test Album" />);
    expect(screen.getByText(/no track information available/i)).toBeInTheDocument();
  });

  it('renders favourite button for each track', () => {
    renderWithProvider(<TrackList tracks={mockTracks} albumName="Test Album" />);
    expect(screen.getByTestId('favourite-Artist A-Test Album-Track 1')).toBeInTheDocument();
    expect(screen.getByTestId('favourite-Artist A-Test Album-Track 2')).toBeInTheDocument();
  });

  it('creates track links with correct URLs', () => {
    renderWithProvider(<TrackList tracks={mockTracks} albumName="Test Album" />);
    const link1 = screen.getByText('Track 1').closest('a');
    const link2 = screen.getByText('Track 2').closest('a');
    expect(link1).toHaveAttribute('href', 'https://example.com/track1');
    expect(link2).toHaveAttribute('href', 'https://example.com/track2');
  });
});



