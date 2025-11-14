import React from 'react';
import { useMusicStore } from '../../store/store';
import type { AppView } from '../../utils/types';
import { Box, Flex, Text, Button, Container } from '@chakra-ui/react';

const NavButton: React.FC<{
  view: AppView;
  children: React.ReactNode;
  inDetailView: boolean;
  active: boolean;
  onViewChange: (view: AppView) => void;
}> = ({ view, children, inDetailView, active, onViewChange }) => {
  return (
    <Button
      onClick={() => onViewChange(view)}
      disabled={inDetailView}
      px={4}
      py={2}
      fontSize="sm"
      fontWeight="semibold"
      borderRadius="md"
      transition="all"
      transitionDuration="300ms"
      bg={active ? 'pink.600' : 'transparent'}
      color={active ? 'white' : 'gray.300'}
      _hover={active ? {} : { bg: 'gray.700' }}
      opacity={inDetailView ? 0.5 : 1}
      cursor={inDetailView ? 'not-allowed' : 'pointer'}
    >
      {children}
    </Button>
  );
};

export const Navbar: React.FC = () => {
  const {
    currentView,
    setView,
    favourites,
    selectedAlbum,
    selectedArtist,
    clearSelectedAlbum,
    clearSelectedArtist,
  } = useMusicStore();

  const inDetailView = !!selectedAlbum || !!selectedArtist;

  const handleBackClick = () => {
    if (selectedAlbum) {
      clearSelectedAlbum();
    } else if (selectedArtist) {
      clearSelectedArtist();
    }
  };

  return (
    <Box
      as="header"
      bg="rgba(31, 41, 55, 0.5)"
      backdropFilter="blur(4px)"
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="lg"
    >
      <Container maxW="container.xl" px={4} py={4}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={4}>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="pink.500">
              Music Explorer
            </Text>
            <Box
              as="nav"
              display={{ base: 'none', md: 'flex' }}
              alignItems="center"
              gap={2}
              bg="rgba(55, 65, 81, 0.5)"
              p={1}
              borderRadius="lg"
            >
              <NavButton
                view="search"
                inDetailView={inDetailView}
                active={currentView === 'search' && !inDetailView}
                onViewChange={setView}
              >
                Search
              </NavButton>
              <NavButton
                view="favourites"
                inDetailView={inDetailView}
                active={currentView === 'favourites' && !inDetailView}
                onViewChange={setView}
              >
                Favourites ({favourites.length})
              </NavButton>
            </Box>
          </Flex>

          {(selectedAlbum || selectedArtist) && (
            <Button
              onClick={handleBackClick}
              display="flex"
              alignItems="center"
              bg="gray.700"
              _hover={{ bg: 'gray.600' }}
              color="white"
              fontWeight="semibold"
              py={2}
              px={4}
              borderRadius="lg"
              transition="colors"
              transitionDuration="300ms"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20px"
                height="20px"
                style={{ marginRight: '8px' }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Button>
          )}
        </Flex>
      </Container>
      <Box display={{ base: 'block', md: 'none' }}>
        <Container maxW="container.xl" px={4} pb={3}>
          <Box
            as="nav"
            display="flex"
            alignItems="center"
            gap={2}
            bg="rgba(55, 65, 81, 0.5)"
            p={1}
            borderRadius="lg"
          >
            <NavButton
              view="search"
              inDetailView={inDetailView}
              active={currentView === 'search' && !inDetailView}
              onViewChange={setView}
            >
              Search
            </NavButton>
            <NavButton
              view="favourites"
              inDetailView={inDetailView}
              active={currentView === 'favourites' && !inDetailView}
              onViewChange={setView}
            >
              Favourites ({favourites.length})
            </NavButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
