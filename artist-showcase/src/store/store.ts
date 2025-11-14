import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getAlbumInfo,
  searchAlbums,
  searchTracks,
  getArtistTopAlbums,
} from '../services/lastfmService';
import type {
  AlbumDetail,
  AlbumSearchResult,
  SearchType,
  TrackSearchResult,
  FavouriteTrack,
  AppView,
  FavouriteAlbum,
  ArtistSortOption,
  TrackIdentifier,
  AlbumIdentifier,
  FavouritesSortOption,
  TrackSortOption,
  SearchResultsSortOption,
} from '../../src/utils/types';

interface MusicState {
  searchTerm: string;
  searchType: SearchType;
  albumResults: AlbumSearchResult[];
  trackResults: TrackSearchResult[];
  selectedAlbum: AlbumDetail | null;
  selectedArtist: { name: string } | null;
  artistAlbums: AlbumDetail[];
  artistSortOption: ArtistSortOption;
  favouritesSort: FavouritesSortOption;
  trackSortOption: TrackSortOption;
  searchResultsSort: SearchResultsSortOption;
  loading: boolean;
  error: string | null;
  favourites: FavouriteTrack[];
  favouriteAlbums: FavouriteAlbum[];
  currentView: AppView;
  previousView: AppView;
  setSearchTerm: (term: string) => void;
  setSearchType: (type: SearchType) => void;
  setView: (view: AppView) => void;
  executeSearch: () => Promise<void>;
  fetchAlbumDetails: (artist: string, albumName: string) => Promise<void>;
  clearSelectedAlbum: () => void;
  fetchArtistDetails: (artistName: string) => Promise<void>;
  clearSelectedArtist: () => void;
  setArtistSortOption: (option: ArtistSortOption) => void;
  setFavouritesSort: (option: FavouritesSortOption) => void;
  setTrackSortOption: (option: TrackSortOption) => void;
  setSearchResultsSort: (option: SearchResultsSortOption) => void;
  addFavourite: (track: TrackIdentifier) => void;
  removeFavourite: (trackId: string) => void;
  isFavourite: (trackId: string) => boolean;
  addFavouriteAlbum: (album: AlbumIdentifier) => void;
  removeFavouriteAlbum: (albumId: string) => void;
  isFavouriteAlbum: (albumId: string) => boolean;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      searchTerm: 'Daft Punk',
      searchType: 'album',
      albumResults: [],
      trackResults: [],
      selectedAlbum: null,
      selectedArtist: null,
      artistAlbums: [],
      artistSortOption: 'release_desc',
      favouritesSort: 'date_desc',
      trackSortOption: 'rank_asc',
      searchResultsSort: 'relevance',
      loading: false,
      error: null,
      favourites: [],
      favouriteAlbums: [],
      currentView: 'search',
      previousView: 'search',

      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setSearchType: (type: SearchType) => set({ searchType: type }),
      setView: (view: AppView) => set({ currentView: view }),
      setArtistSortOption: (option: ArtistSortOption) => set({ artistSortOption: option }),
      setFavouritesSort: (option: FavouritesSortOption) => set({ favouritesSort: option }),
      setTrackSortOption: (option: TrackSortOption) => set({ trackSortOption: option }),
      setSearchResultsSort: (option: SearchResultsSortOption) => set({ searchResultsSort: option }),

      executeSearch: async () => {
        const { searchTerm, searchType } = get();
        if (!searchTerm.trim()) return;

        set({
          loading: true,
          error: null,
          albumResults: [],
          trackResults: [],
          searchResultsSort: 'relevance',
        });
        try {
          if (searchType === 'album') {
            const albums = await searchAlbums(searchTerm);
            set({ albumResults: albums });
          } else {
            const tracks = await searchTracks(searchTerm);
            set({ trackResults: tracks });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An unknown error occurred.';
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      fetchAlbumDetails: async (artist: string, albumName: string) => {
        set({ loading: true, error: null, trackSortOption: 'rank_asc' });
        try {
          const albumDetails = await getAlbumInfo(artist, albumName);
          set({ selectedAlbum: albumDetails });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Could not fetch album details.';
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      clearSelectedAlbum: () =>
        set({ selectedAlbum: null, error: null, trackSortOption: 'rank_asc' }),

      fetchArtistDetails: async (artistName: string) => {
        set({
          loading: true,
          error: null,
          selectedArtist: { name: artistName },
          artistAlbums: [],
          selectedAlbum: null,
        });
        try {
          const albums = await getArtistTopAlbums(artistName);
          set({ artistAlbums: albums });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Could not fetch artist details.';
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      clearSelectedArtist: () =>
        set({ selectedArtist: null, artistAlbums: [], artistSortOption: 'release_desc' }),

      addFavourite: (track: TrackIdentifier) => {
        set((state) => ({
          favourites: [...state.favourites, { ...track, dateAdded: Date.now() }],
        }));
      },
      removeFavourite: (trackId: string) => {
        set((state) => ({
          favourites: state.favourites.filter((fav) => fav.id !== trackId),
        }));
      },
      isFavourite: (trackId: string) => {
        return get().favourites.some((fav) => fav.id === trackId);
      },

      addFavouriteAlbum: (album: AlbumIdentifier) => {
        set((state) => ({
          favouriteAlbums: [...state.favouriteAlbums, { ...album, dateAdded: Date.now() }],
        }));
      },
      removeFavouriteAlbum: (albumId: string) => {
        set((state) => ({
          favouriteAlbums: state.favouriteAlbums.filter((fav) => fav.id !== albumId),
        }));
      },
      isFavouriteAlbum: (albumId: string) => {
        return get().favouriteAlbums.some((fav) => fav.id === albumId);
      },
    }),
    {
      name: 'music-explorer-favourites',
      version: 1, // Increment version for schema change
      partialize: (state) => ({
        favourites: state.favourites,
        favouriteAlbums: state.favouriteAlbums,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < 1) {
          // If the stored state is from a version before 1, add the `dateAdded` property.
          const now = Date.now();
          if (persistedState.favourites) {
            persistedState.favourites = (persistedState.favourites as any[]).map((fav, index) => ({
              ...fav,
              dateAdded: fav.dateAdded || now - index * 1000, // Stagger timestamps slightly
            }));
          }
          if (persistedState.favouriteAlbums) {
            persistedState.favouriteAlbums = (persistedState.favouriteAlbums as any[]).map(
              (fav, index) => ({
                ...fav,
                dateAdded: fav.dateAdded || now - index * 1000,
              })
            );
          }
        }
        return persistedState;
      },
    }
  )
);
