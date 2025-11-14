import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAlbums, searchTracks, getAlbumInfo, getArtistTopAlbums } from '../lastfmService';

// Import environment variables directly (supports both process.env and Vite's import.meta.env)
const API_BASE_URL = process.env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';
const API_KEY = process.env.API_KEY || import.meta.env.VITE_API_KEY || '';

// Mock fetch globally
global.fetch = vi.fn();

describe('lastfmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchAlbums', () => {
    it('returns empty array when no results', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            albummatches: '',
          },
        }),
      });

      const result = await searchAlbums('nonexistent');
      expect(result).toEqual([]);
    });

    it('returns albums from API response', async () => {
      const mockAlbums = [
        {
          name: 'Album 1',
          artist: 'Artist 1',
          url: 'https://example.com/album1',
          image: [],
        },
      ];

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: {
              albummatches: {
                album: mockAlbums,
              },
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            album: {
              name: 'Album 1',
              artist: 'Artist 1',
              wiki: {
                published: '25 Mar 2020, 15:47',
              },
            },
          }),
        });

      const result = await searchAlbums('test');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Album 1');
    });

    it('handles API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 6,
          message: 'Invalid API key',
        }),
      });

      await expect(searchAlbums('test')).rejects.toThrow('Invalid API key');
    });

    it('handles network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(searchAlbums('test')).rejects.toThrow();
    });
  });

  describe('searchTracks', () => {
    it('returns empty array when no results', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            trackmatches: '',
          },
        }),
      });

      const result = await searchTracks('nonexistent');
      expect(result).toEqual([]);
    });

    it('returns tracks from API response', async () => {
      const mockTracks = [
        {
          name: 'Track 1',
          artist: 'Artist 1',
          url: 'https://example.com/track1',
          image: [],
          listeners: '1000',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            trackmatches: {
              track: mockTracks,
            },
          },
        }),
      });

      const result = await searchTracks('test');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Track 1');
    });

    it('handles single track result', async () => {
      const mockTrack = {
        name: 'Track 1',
        artist: 'Artist 1',
        url: 'https://example.com/track1',
        image: [],
        listeners: '1000',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            trackmatches: {
              track: mockTrack, // Single object, not array
            },
          },
        }),
      });

      const result = await searchTracks('test');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Track 1');
    });
  });

  describe('getAlbumInfo', () => {
    it('returns album details', async () => {
      const mockAlbumData = {
        album: {
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
                '@attr': { rank: 1 },
              },
            ],
          },
          tags: {
            tag: [{ name: 'Electronic', url: 'https://example.com/tag' }],
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlbumData,
      });

      const result = await getAlbumInfo('Test Artist', 'Test Album');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Album');
      expect(result?.artist).toBe('Test Artist');
    });

    it('returns null when album not found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await getAlbumInfo('Test Artist', 'Nonexistent Album');
      expect(result).toBeNull();
    });

    it('handles errors and re-throws them', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(getAlbumInfo('Test Artist', 'Test Album')).rejects.toThrow('Network error');
    });

    it('normalizes single tag to array', async () => {
      const mockAlbumData = {
        album: {
          name: 'Test Album',
          artist: 'Test Artist',
          url: 'https://example.com/album',
          image: [],
          listeners: '10000',
          playcount: '50000',
          tracks: { track: [] },
          tags: {
            tag: { name: 'Electronic', url: 'https://example.com/tag' }, // Single object
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlbumData,
      });

      const result = await getAlbumInfo('Test Artist', 'Test Album');
      expect(Array.isArray(result?.tags.tag)).toBe(true);
    });
  });

  describe('getArtistTopAlbums', () => {
    it('returns empty array when no albums', async () => {
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            topalbums: {
              album: [],
            },
          }),
        });

      const result = await getArtistTopAlbums('Test Artist');
      expect(result).toEqual([]);
    });

    it('returns albums with details', async () => {
      const mockTopAlbums = {
        topalbums: {
          album: [
            {
              name: 'Album 1',
              artist: { name: 'Test Artist' },
            },
          ],
        },
      };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopAlbums,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            album: {
              name: 'Album 1',
              artist: 'Test Artist',
              url: 'https://example.com/album1',
              image: [],
              listeners: '1000',
              playcount: '5000',
              tracks: { track: [] },
              tags: { tag: [] },
              wiki: {
                published: '25 Mar 2020, 15:47',
              },
            },
          }),
        });

      const result = await getArtistTopAlbums('Test Artist');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Album 1');
    });

    it('handles errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(getArtistTopAlbums('Test Artist')).rejects.toThrow('Network error');
    });
  });

  describe('API request format', () => {
    it('includes API key and format in requests', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            trackmatches: {
              track: [],
            },
          },
        }),
      });

      await searchTracks('test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`api_key=${API_KEY}`)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('format=json')
      );
    });
  });
});

