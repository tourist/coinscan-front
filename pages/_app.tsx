import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Navigation from '../components/Navigation/Navigation';
import { offsetLimitPagination } from '@apollo/client/utilities';

import type { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Notification from '../components/Notification/Notification';
import NotificationsProvider from '../components/Notification/NotificationProvider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#008cff',
    },
  },

  typography: {
    fontFamily: ['Open Sans', 'sans-serif'].join(','),
  },
});

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
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
        <NotificationsProvider>
          <Box sx={{ my: 3 }}>
            <Container maxWidth="xl">
              <Grid container>
                <Grid item xs={12}>
                  <Navigation />
                </Grid>
                <Box sx={{ my: 2 }}>
                  <Component {...pageProps} />
                </Box>
              </Grid>
            </Container>
          </Box>
          <Notification />
        </NotificationsProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
