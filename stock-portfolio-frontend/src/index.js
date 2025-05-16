// src/index.js (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider, extendTheme, CSSReset } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Force dark mode initially
    useSystemColorMode: false,  // Do not follow OS preference
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',       // Your main dark background (e.g., for entire page)
        color: 'whiteAlpha.900', // Default light text color
        lineHeight: 'base',
      },
      'html, body, #root': { // Optional: Ensure full height for app container
        height: '100%',
      },
    },
  },
  colors: {
    brand: { // Your "teal" for accents and primary actions
      50: "#E6FFFA",
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2AC",
      500: "#319795", // A good primary teal
      600: "#2C7A7B", // Darker teal for hover/active states
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044",
    },
    // Specific semantic colors for UI elements in dark mode
    appBg: 'gray.900',        // Consistent with body background
    cardBg: 'gray.800',       // Background for card-like containers
    cardBorder: 'gray.700',   // Border color for cards
    textPrimaryDark: 'whiteAlpha.900', // Primary text (redundant if body sets it)
    textSecondaryDark: 'gray.400',     // For less prominent text
    // You can add more specific colors here if needed
  },
  components: {
    // Example: Global styling for Inputs to fit the dark theme
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'gray.700', // Input background in dark mode
            borderColor: 'gray.600', // Input border
            color: 'whiteAlpha.900', // Input text color
            _hover: {
              borderColor: 'gray.500',
            },
            _focus: {
              borderColor: 'brand.400', // Teal border on focus
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-400)`,
            },
            _placeholder: { // Style placeholder text
              color: 'gray.500',
            }
          },
        },
      },
    },
    // Example: Global styling for Select to fit the dark theme
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'gray.700',
            borderColor: 'gray.600',
            color: 'whiteAlpha.900',
            _hover: {
              borderColor: 'gray.500',
            },
            _focus: {
              borderColor: 'brand.400',
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-400)`,
            }
          },
          icon: { // Style the dropdown arrow
            color: 'gray.400',
          }
        },
      },
    },
    // Example: Defaulting Button colorScheme for some variants
    // Button: {
    //   defaultProps: {
    //     colorScheme: 'brand', // This makes standard buttons use your teal
    //   },
    // },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* CSSReset is often recommended but can be part of global styles.
          If you notice unexpected browser default styling issues, uncommenting
          or adding more to `theme.styles.global` might be needed.
      */}
      {/* <CSSReset /> */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);