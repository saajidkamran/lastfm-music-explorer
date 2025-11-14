import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Render a custom fallback UI
      return (
        <Box
          bg="rgba(127, 29, 29, 0.5)"
          border="1px"
          borderColor="red.700"
          color="red.300"
          px={4}
          py={3}
          borderRadius="lg"
          position="relative"
          textAlign="center"
          role="alert"
        >
          <Text as="h1" fontWeight="bold" fontSize="lg" mb={2}>
            Something went wrong.
          </Text>
          <Text as="p">
            We're sorry, an unexpected error occurred. Please try refreshing the page.
          </Text>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
