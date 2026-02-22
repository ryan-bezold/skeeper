import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e3f2ff',
      100: '#b8d9ff',
      200: '#8cc0ff',
      300: '#60a7ff',
      400: '#348eff',
      500: '#1a75e6',
      600: '#105bb4',
      700: '#084182',
      800: '#022751',
      900: '#000d21',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
      // Ensure smooth scrolling on mobile
      html: {
        scrollBehavior: 'smooth',
      },
    },
  },
  // Mobile-first breakpoints (default Chakra breakpoints)
  breakpoints: {
    base: '0em',    // 0px - mobile
    sm: '30em',     // 480px - small mobile
    md: '48em',     // 768px - tablet
    lg: '62em',     // 992px - desktop
    xl: '80em',     // 1280px - large desktop
    '2xl': '96em',  // 1536px - extra large
  },
  components: {
    // Ensure buttons are touch-friendly on mobile
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
      sizes: {
        md: {
          minH: '44px', // Minimum touch target size for mobile
        },
        lg: {
          minH: '48px',
        },
      },
    },
    // Make containers responsive
    Container: {
      baseStyle: {
        px: { base: 4, md: 6, lg: 8 },
      },
    },
  },
});
