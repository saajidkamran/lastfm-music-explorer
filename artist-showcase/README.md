# Music Explorer

A modern, responsive web application for exploring music using the Last.fm API. Search for albums and tracks, view detailed information, and save your favorites.

## Features

- **Search Music**: Search for albums and tracks from the Last.fm database
- **Album Details**: View comprehensive album information including:
  - Album artwork, artist, and metadata
  - Track listings with play counts
  - Interactive play count charts
  - Album tags and descriptions
- **Favorites**: Save your favorite albums and tracks with persistent storage
- **Advanced Sorting**: Sort search results and tracks by various criteria:
  - Name (A-Z, Z-A)
  - Artist (A-Z, Z-A)
  - Year (newest/oldest for albums)
  - Popularity (most/least popular for tracks)
  - Track number and duration
- **Modern UI**: Built with Chakra UI v3 featuring:
  - Dark theme with pink accents
  - Responsive design for mobile and desktop
  - Smooth animations and transitions
  - Accessible components

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library
- **Zustand** - State management with persistence
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Prerequisites

- Node.js 18+ and npm

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd artist-showcase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_lastfm_api_key
VITE_API_BASE_URL=https://ws.audioscrobbler.com/2.0/
VITE_DEFAULT_ART_IMAGE=https://picsum.photos/300/300
```

**Getting a Last.fm API Key:**
1. Visit [Last.fm API Account](https://www.last.fm/api/account/create)
2. Create an account or sign in
3. Create a new API application
4. Copy your API key and add it to `.env`

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for production

```bash
npm run build
```

The production build will be in the `dist` directory.


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── components/
│   ├── album/          # Album-related components
│   │   ├── AlbumDetailView.tsx
│   │   ├── AlbumPlayCountChart.tsx
│   │   └── TrackList.tsx
│   ├── common/         # Reusable components
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── FavouriteAlbumButton.tsx
│   │   ├── FavouriteButton.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Spinner.tsx
│   └── search/         # Search-related components
│       ├── SearchBar.tsx
│       └── SearchResults.tsx
├── services/           # API services
│   └── lastfmService.ts
├── store/              # State management
│   └── store.ts
├── utils/              # Utilities and types
│   └── types.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Usage

### Searching

1. Enter a search term in the search bar (default: "Daft Punk")
2. Select whether to search for "Albums" or "Tracks"
3. Click the Search button or press Enter
4. Results will be displayed in a responsive grid

### Viewing Album Details

1. Click on any album from the search results
2. View album information including:
   - High-resolution album artwork
   - Listener and play count statistics
   - Track listing with sortable options
   - Play count visualization chart
   - Tags and album description

### Managing Favorites

- **Add to Favorites**: Click the heart icon on albums or tracks
- **View Favorites**: Navigate to the "Favourites" tab in the navbar
- **Remove from Favorites**: Click the heart icon again to unfavorite

### Sorting

- **Search Results**: Use the sort dropdown to organize results by name, artist, year, or popularity
- **Track List**: Sort tracks by number, name, duration, or play count
- **Favorites**: Sort your saved items by various criteria

## State Management

The application uses Zustand for state management with localStorage persistence. Favorites are automatically saved and restored between sessions.

## Testing

Tests are written using Vitest and React Testing Library. Run tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- [Last.fm API](https://www.last.fm/api) for providing music data
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Vite](https://vitejs.dev/) for the excellent development experience
