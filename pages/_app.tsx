import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { offsetLimitPagination } from '@apollo/client/utilities';

import type { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tourist/coinscan',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          wallets: offsetLimitPagination(),
        },
      },
    },
  }),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
