// Common style objects for consistent styling across components
import type React from 'react';

export const selectStyles = {
  base: {
    backgroundColor: '#374151',
    color: 'white',
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 300ms',
    outline: 'none',
  } as React.CSSProperties,
  focus: {
    borderColor: '#ec4899',
    boxShadow: 'none',
  },
  blur: {
    borderColor: 'transparent',
  },
};

export const cardStyles = {
  container: {
    bg: 'gray.800',
    borderRadius: 'lg',
    overflow: 'hidden',
    boxShadow: 'lg',
    transform: 'auto',
    transition: 'all',
    transitionDuration: '300ms',
    cursor: 'pointer',
  },
  hover: {
    transform: 'translateY(-4px)',
    boxShadow: '2xl',
    shadowColor: 'rgba(236, 72, 153, 0.1)',
  },
  imageOverlay: {
    position: 'absolute' as const,
    inset: 0,
    bg: 'rgba(0, 0, 0, 0.4)',
    transition: 'all',
    transitionDuration: '300ms',
  },
  imageOverlayHover: {
    bg: 'rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: 'sm',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'white',
    transition: 'colors',
    transitionDuration: '200ms',
  },
  titleHover: {
    color: 'pink.400',
  },
  subtitle: {
    fontSize: 'xs',
    color: 'gray.400',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subtitleHover: {
    color: 'pink.400',
    textDecoration: 'underline',
  },
};

export const errorMessageStyles = {
  container: {
    bg: 'rgba(127, 29, 29, 0.5)',
    border: '1px',
    borderColor: 'red.700',
    color: 'red.300',
    px: 4,
    py: 3,
    borderRadius: 'lg',
    position: 'relative',
    textAlign: 'center',
    role: 'alert',
  },
};

export const searchBarStyles = {
  container: {
    mb: 8,
    p: 6,
    bg: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 'xl',
    boxShadow: 'lg',
    backdropFilter: 'blur(8px)',
  },
  input: {
    flex: '1',
    bg: 'gray.700',
    color: 'white',
    border: '2px',
    borderColor: 'transparent',
    borderRadius: 'lg',
    px: 4,
    py: 3,
    transition: 'all',
    transitionDuration: '300ms',
  },
  inputFocus: {
    borderColor: 'pink.500',
    boxShadow: 'none',
  },
  inputPlaceholder: {
    color: 'gray.400',
  },
  searchButton: {
    bg: 'pink.600',
    color: 'white',
    fontWeight: 'bold',
    py: 3,
    px: 6,
    borderRadius: 'lg',
    transition: 'colors',
    transitionDuration: '300ms',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonHover: {
    bg: 'pink.700',
  },
  typeSelectorContainer: {
    mt: 4,
    justify: 'center',
    gap: 2,
    bg: 'rgba(55, 65, 81, 0.5)',
    p: 1,
    borderRadius: 'lg',
    w: { base: '100%', sm: 'auto' },
    maxW: { sm: 'xs' },
    mx: 'auto',
  },
  typeButton: {
    w: { base: '100%', sm: 'auto' },
    textAlign: 'center',
    px: 4,
    py: 2,
    fontSize: 'sm',
    fontWeight: 'semibold',
    borderRadius: 'md',
    transition: 'colors',
    transitionDuration: '300ms',
  },
  typeButtonActive: {
    bg: 'pink.600',
    color: 'white',
  },
  typeButtonInactive: {
    bg: 'transparent',
    color: 'gray.300',
  },
  typeButtonHover: {
    bg: 'rgba(55, 65, 81, 0.5)',
  },
};

export const searchResultsStyles = {
  header: {
    flexDirection: { base: 'column', sm: 'row' },
    justify: { sm: 'space-between' },
    align: { sm: 'center' },
    gap: 4,
    mb: 6,
    borderBottom: '2px',
    borderColor: 'gray.700',
    pb: 2,
  },
  title: {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'gray.300',
  },
};

export const albumDetailStyles = {
  statsContainer: {
    mt: 4,
    justify: 'space-around',
    textAlign: 'center',
    fontSize: 'sm',
    bg: 'rgba(31, 41, 55, 0.5)',
    p: 3,
    borderRadius: 'lg',
  },
  tracklistHeader: {
    flexDirection: { base: 'column', sm: 'row' },
    justify: { sm: 'space-between' },
    align: { sm: 'center' },
    gap: 2,
    mb: 4,
    borderBottom: '2px',
    borderColor: 'gray.700',
    pb: 2,
  },
  tracklistTitle: {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'gray.300',
  },
};

export const textTruncateStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const svgIconStyles = {
  searchIcon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  heartIcon: {
    width: '20px',
    height: '20px',
    position: 'absolute' as const,
    transition: 'all 300ms',
  },
};

