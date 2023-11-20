import React from 'react';
import '../styles/globals.css'; // Adjust the path according to your file structure

// This function takes two props: Component and pageProps.
// Component is the active page, so whenever you navigate between routes,
// Component will change to the new page. Therefore, any props you send to Component
// will be received by the page.
function MyApp({ Component, pageProps }) {
  // You can include layout components around <Component /> if you have any
  return <Component {...pageProps} />;
}

export default MyApp;
