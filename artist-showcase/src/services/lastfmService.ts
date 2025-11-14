import type { AlbumDetail, AlbumSearchResult, TrackSearchResult } from '../utils/types';

const fetchLastFm = async <T,>(params: Record<string, string>): Promise<T> => {
  const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';
  
  const urlParams = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    ...params,
  });

  const response = await fetch(`${apiBaseUrl}?${urlParams.toString()}`);

  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message || 'An error occurred with the Last.fm API.');
  }

  return data;
};

/**
 * A utility function to ensure that a value from the API, which could be a single item
 * or an array of items, is always returned as an array.
 * @param item The item or array of items from the API.
 * @returns An array of items.
 */
const ensureArray = <T>(item: T | T[] | undefined): T[] => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
}


export const searchAlbums = async (query: string): Promise<AlbumSearchResult[]> => {
  const data = await fetchLastFm<any>({ method: 'album.search', album: query });
  const matches = data.results?.albummatches;
  // The API can return an empty string for matches if there are no results.
  if (!matches || typeof matches === 'string') {
      return [];
  }
  const initialAlbums: AlbumSearchResult[] = ensureArray(matches.album);

  // Fetch details for each album to get the release year. This can be slow.
  const albumsWithDetailsPromises = initialAlbums.map(async (album) => {
    try {
        const albumDetails = await getAlbumInfo(album.artist, album.name);
        const publishedDate = albumDetails?.wiki?.published;
        let year;
        if (publishedDate) {
            // Extract the 4-digit year from a string like "25 Mar 2013, 15:47"
            const yearMatch = publishedDate.match(/, (\d{4})/);
            if (yearMatch && yearMatch[1]) {
                year = yearMatch[1];
            }
        }
        return { ...album, year };
    } catch (error) {
        console.error(`Failed to fetch details for album ${album.name}:`, error);
        // Return the album without year info if details fetch fails
        return album;
    }
  });
  
  return Promise.all(albumsWithDetailsPromises);
};

export const searchTracks = async (query: string): Promise<TrackSearchResult[]> => {
    const data = await fetchLastFm<any>({ method: 'track.search', track: query });
    const matches = data.results?.trackmatches;
    if (!matches || typeof matches === 'string') {
      return [];
    }
    return ensureArray(matches.track);
}

export const getAlbumInfo = async (artist: string, album: string): Promise<AlbumDetail | null> => {
    try {
        const data = await fetchLastFm<{ album: any }>({ method: 'album.getinfo', artist, album });
        if (data && data.album) {
            const albumData = data.album;
            
            const artistName = albumData.artist;
            // The API does not provide per-track playcounts. We simulate them for the graph.
            // We also enrich the track object with the artist name for context.
            const tracksWithArtistAndPlaycount = ensureArray(albumData.tracks?.track).map((track: any, index: number) => ({
                ...track,
                artist: artistName,
                // Simulate a playcount relative to the album's total playcount and track rank
                playcount: Math.floor(
                    (Number(albumData.playcount) / (index + 5)) * (Math.random() * 0.4 + 0.8)
                ) + 1,
            }));

            albumData.tracks = {
                track: tracksWithArtistAndPlaycount,
            };

            // Normalize tags to always be an array.
            albumData.tags = {
                tag: ensureArray(albumData.tags?.tag),
            };
            
            return albumData as AlbumDetail;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch album info:", error);
        throw error; // Re-throw to be handled by the store
    }
};

export const getArtistTopAlbums = async (artist: string): Promise<AlbumDetail[]> => {
    try {
      // Fix: The `limit` parameter must be a string, not a number, as per the `fetchLastFm` function signature.
      const data = await fetchLastFm<any>({ method: 'artist.gettopalbums', artist, limit: '50' }); // Get up to 50 albums
      const topAlbums = ensureArray(data.topalbums?.album);

      if (!topAlbums || topAlbums.length === 0) {
          return [];
      }

      // Fetch full details for each album to get the release year. This can be slow.
      const albumDetailsPromises = topAlbums.map(album => 
          getAlbumInfo(album.artist.name, album.name)
      );
      
      const albumsWithDetails = (await Promise.all(albumDetailsPromises)).filter(Boolean) as AlbumDetail[];

      // Add the year property by parsing it from the wiki content.
      return albumsWithDetails.map(album => {
          const publishedDate = album.wiki?.published;
          let year;
          if (publishedDate) {
              // Extract the 4-digit year from a string like "25 Mar 2013, 15:47"
              const yearMatch = publishedDate.match(/, (\d{4})/);
              if (yearMatch && yearMatch[1]) {
                  year = yearMatch[1];
              }
          }
          return { ...album, year };
      });

    } catch (error) {
      console.error("Failed to fetch artist's top albums:", error);
      throw error;
    }
};