import React from 'react';
import '../styles/globals.css'; 
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '../styles/theme';
import { SkillsProvider } from 'context/skillscontext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <SkillsProvider>
        <Component {...pageProps} />
      </SkillsProvider>
    </ChakraProvider>
  )
}

export default MyApp;
