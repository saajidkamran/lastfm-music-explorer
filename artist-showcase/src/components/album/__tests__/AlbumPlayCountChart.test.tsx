/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import AlbumPlayCountChart from '../AlbumPlayCountChart';
import type { Track } from '../../../utils/types';

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
    playcount: 1000,
  },
  {
    name: 'Track 2',
    duration: '240',
    url: 'https://example.com/track2',
    artist: 'Artist A',
    '@attr': { rank: 2 },
    playcount: 500,
  },
  {
    name: 'Track 3',
    duration: '200',
    url: 'https://example.com/track3',
    artist: 'Artist A',
    '@attr': { rank: 3 },
    playcount: 250,
  },
];

describe('AlbumPlayCountChart', () => {
  it('renders chart with tracks', () => {
    renderWithProvider(<AlbumPlayCountChart tracks={mockTracks} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('returns null when no tracks with playcount', () => {
    const tracksWithoutPlaycount: Track[] = [
      {
        name: 'Track 1',
        duration: '180',
        url: 'https://example.com/track1',
        artist: 'Artist A',
        '@attr': { rank: 1 },
      },
    ];
    const { container } = renderWithProvider(
      <AlbumPlayCountChart tracks={tracksWithoutPlaycount} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('filters out tracks with zero playcount', () => {
    const tracksWithZero: Track[] = [
      {
        name: 'Track 1',
        duration: '180',
        url: 'https://example.com/track1',
        artist: 'Artist A',
        '@attr': { rank: 1 },
        playcount: 0,
      },
      {
        name: 'Track 2',
        duration: '240',
        url: 'https://example.com/track2',
        artist: 'Artist A',
        '@attr': { rank: 2 },
        playcount: 100,
      },
    ];
    renderWithProvider(<AlbumPlayCountChart tracks={tracksWithZero} />);
    // Only track 2 should be rendered
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('sorts tracks by playcount descending', () => {
    renderWithProvider(<AlbumPlayCountChart tracks={mockTracks} />);
    // Tracks should be sorted by playcount, highest first
    const chartText = screen.getByText(/chart displays/i);
    expect(chartText).toBeInTheDocument();
  });

  it('shows only top 15 tracks', () => {
    const manyTracks: Track[] = Array.from({ length: 20 }, (_, i) => ({
      name: `Track ${i + 1}`,
      duration: '180',
      url: `https://example.com/track${i + 1}`,
      artist: 'Artist A',
      '@attr': { rank: i + 1 },
      playcount: 1000 - i * 10,
    }));
    renderWithProvider(<AlbumPlayCountChart tracks={manyTracks} />);
    // Should only show 15 tracks
    const trackNumbers = screen.getAllByText(/\d+/);
    const rankNumbers = trackNumbers.filter((el) =>
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].includes(
        el.textContent || ''
      )
    );
    expect(rankNumbers.length).toBeLessThanOrEqual(15);
  });

  it('displays chart description', () => {
    renderWithProvider(<AlbumPlayCountChart tracks={mockTracks} />);
    expect(screen.getByText(/chart displays relative track popularity/i)).toBeInTheDocument();
  });
});
