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
import GitHubIcon from '@mui/icons-material/GitHub';

import Link from '../components/Link';
import Navigation from '../components/Navigation/Navigation';
import settings from '../settings.json';
import createApolloClient from '../utils/apolloClient';
import Notification from '../components/Notification/Notification';
import NotificationsProvider from '../components/Notification/NotificationProvider';
import {
  useNotifications,
  NOTIFICATION_TYPES,
} from '../components/Notification';
import { Typography } from '@mui/material';

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

const title = `${settings.tokenTicker} - ${settings.tokenName} - 
 ${settings.globalHtmlTitleSuffix}`;

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
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
                    <Typography variant="h6" component="h1">
                      {title}
                    </Typography>
                    <Navigation sx={{ mt: 2 }} />
                  </Grid>
                  <Box sx={{ my: 2, width: '100%' }}>
                    <Component {...pageProps} />
                  </Box>
                </Grid>
                <Box>
                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                    }}
                    variant="body2"
                  >
                    Want your chosen token to be tracked same way? Have any
                    issues?
                    <Box
                      component="span"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                      }}
                    >
                      <Link
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                          color: '#ffffff',
                        }}
                        href="https://github.com/tourist/coinscan-front"
                        title={title}
                        target="_blank"
                        rel="noopener"
                      >
                        Visit
                        <GitHubIcon sx={{ ml: 0.5 }} />
                      </Link>
                    </Box>
                  </Typography>
                </Box>
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
