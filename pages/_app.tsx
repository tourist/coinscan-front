import { ReactNode, useMemo } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { ErrorHandler } from '@apollo/client/link/error';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Navigation from '../components/Navigation/Navigation';
import settings from '../settings.json';
import createApolloClient from '../utils/apolloClient';
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

function NotificationApolloProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement | null {
  const { addNotification } = useNotifications();
  const apolloClient = useMemo(() => {
    const onError: ErrorHandler = ({
      graphQLErrors,
      networkError,
      forward,
      operation,
      response,
    }) => {
      addNotification('Fetch error', NOTIFICATION_TYPES.ERROR);
    };

    return createApolloClient(onError);
  }, [addNotification]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          {settings.tokenTicker} - {settings.tokenName} -{' '}
          {settings.globalHtmlTitleSuffix}
        </title>
        <meta
          name="description"
          content={`${settings.tokenTicker} - ${settings.tokenName} - ${settings.globalHtmlTitleSuffix}`}
        />
      </Head>
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
    </>
  );
}

export default App;
