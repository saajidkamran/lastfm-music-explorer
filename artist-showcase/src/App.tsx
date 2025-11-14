import React, { Suspense, lazy } from 'react';
import { useMusicStore } from './store/store';
import SearchBar from './components/search/SearchBar';
import { ErrorMessage } from './components/common/ErrorMessage';
import { Spinner } from './components/common/Spinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Box, Container } from '@chakra-ui/react';

// Lazy load components that are not needed for the initial render
const AlbumDetailView = lazy(() => import('./components/album/AlbumDetailView'));
const FavouritesView = lazy(() => import('./components/favourites/FavouritesView'));
const SearchResults = lazy(() => import('./components/search/SearchResults'));

const App: React.FC = () => {
  const { selectedAlbum, error, loading, currentView, selectedArtist } = useMusicStore();

  const renderContent = () => {
    if (selectedAlbum) return <AlbumDetailView />;
    if (currentView === 'favourites') return <FavouritesView />;

    // Default to search view
    return (
      <>
        <SearchBar />
        {error && !loading && (
          <Box mt={8}>
            <ErrorMessage message={error} />
          </Box>
        )}
        <SearchResults />
      </>
    );
  };

  return (
    <Box minH="100vh" bg="gray.900" color="gray.100" fontFamily="sans-serif">
      <Navbar />

      <Box as="main">
        <Container maxW="container.xl" p={{ base: 4, md: 8 }}>
          <ErrorBoundary>
            <Suspense fallback={<Spinner />}>{renderContent()}</Suspense>
          </ErrorBoundary>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default App;
