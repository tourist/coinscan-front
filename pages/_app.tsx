import { ReactNode, useMemo } from 'react';
import type { AppProps } from 'next/app';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { onError } from '@apollo/client/link/error';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Navigation from '../components/Navigation/Navigation';
import settings from '../settings.json';
import Notification from '../components/Notification/Notification';
import NotificationsProvider from '../components/Notification/NotificationProvider';
import {
  useNotifications,
  NOTIFICATION_TYPES,
} from '../components/Notification';

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

export const paginationMerge = (existing = [], incoming: []) => {
  return [...incoming];
};

function NotificationApolloProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement | null {
  const { addNotification } = useNotifications();
  const apolloClient = useMemo(() => {
    const httpLink = new HttpLink({
      uri: settings.graphqlUri,
    });

    const errorLink = onError(
      ({ graphQLErrors, networkError, forward, operation, response }) => {
        addNotification('Fetch error', NOTIFICATION_TYPES.ERROR);
      }
    );

    return new ApolloClient({
      link: ApolloLink.from([errorLink, httpLink]),
      defaultOptions: {
        query: { errorPolicy: 'ignore' },
      },
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              walletTransactions: {
                keyArgs: false,
                merge: paginationMerge,
              },
              wallets: {
                keyArgs: false,
                merge: paginationMerge,
              },
              transactions: {
                keyArgs: false,
                merge: paginationMerge,
              },
            },
          },
        },
      }),
    });
  }, [addNotification]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationsProvider>
      <NotificationApolloProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box sx={{ my: 3 }}>
            <Container maxWidth="xl">
              <Grid container>
                <Grid item xs={12}>
                  <Navigation />
                </Grid>
                <Box sx={{ my: 2, width: '100%' }}>
                  <Component {...pageProps} />
                </Box>
              </Grid>
            </Container>
          </Box>
          <Notification />
        </ThemeProvider>
      </NotificationApolloProvider>
    </NotificationsProvider>
  );
}

export default App;
