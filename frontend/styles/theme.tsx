import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    customBlue: {
      500: '#0c4a6e'
    },
  },
  components: {
    Button: {
      baseStyle: {
        whiteSpace: 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
        padding: '8px',
      },
    },
  },
});

export default customTheme;