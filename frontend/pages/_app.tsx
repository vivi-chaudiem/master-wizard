import React from 'react';
import '../styles/globals.css'; 
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '../styles/theme';
import { SkillsProvider } from 'context/skillscontext';
import { AdditionalContextProvider } from 'context/additionalcontext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <AdditionalContextProvider>
        <SkillsProvider>
            <Component {...pageProps} />
        </SkillsProvider>
      </AdditionalContextProvider>
    </ChakraProvider>
  )
}

export default MyApp;
