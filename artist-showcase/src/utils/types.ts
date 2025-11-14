export interface Image {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

export interface AlbumSearchResult {
  name: string;
  artist: string;
  url: string;
  image: Image[];
  mbid?: string;
  year?: string;
}

export interface TrackSearchResult {
  name: string;
  artist: string;
  url: string;
  image: Image[];
  listeners: string;
  mbid?: string;
}

export interface Track {
  name: string;
  duration: string;
  url: string;
  artist: string; // Added to associate track with its artist
  playcount?: number; // Added for play count chart
  '@attr': {
    rank: number;
  };
}

export interface AlbumDetail {
  name: string;
  artist: string;
  mbid?: string;
  url: string;
  image: Image[];
  listeners: string;
  playcount: string;
  year?: string; // For sorting artist albums
  tracks: {
    track: Track[];
  };
  tags: {
    tag: { name: string; url: string }[];
  };
  wiki?: {
    published: string;
    summary: string;
    content: string;
  };
}

export interface TrackIdentifier {
  id: string; // Composite key: artist-albumName-trackName
  name: string;
  artist: string;
  albumName: string;
  duration: string;
  url: string;
}

export interface AlbumIdentifier {
  id: string; // Composite key: artist-albumName
  name: string;
  artist: string;
  image: Image[];
  mbid?: string;
}

export interface FavouriteTrack extends TrackIdentifier {
  dateAdded: number;
}

export interface FavouriteAlbum extends AlbumIdentifier {
  dateAdded: number;
}

export type SearchType = 'album' | 'track';
export type AppView = 'search' | 'favourites';
export type ArtistSortOption = 'release_desc' | 'release_asc' | 'name_asc' | 'name_desc';
export type FavouritesSortOption =
  | 'date_desc'
  | 'date_asc'
  | 'name_asc'
  | 'name_desc'
  | 'artist_asc'
  | 'artist_desc'
  | 'album_asc'
  | 'album_desc';
export type TrackSortOption =
  | 'rank_asc'
  | 'name_asc'
  | 'name_desc'
  | 'duration_asc'
  | 'duration_desc'
  | 'playcount_asc'
  | 'playcount_desc';
export type SearchResultsSortOption =
  | 'relevance'
  | 'name_asc'
  | 'name_desc'
  | 'artist_asc'
  | 'artist_desc'
  | 'listeners_asc'
  | 'listeners_desc'
  | 'year_desc'
  | 'year_asc';
