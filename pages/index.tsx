import type { NextPage } from 'next';
import Head from 'next/head';
import Grid from '@mui/material/Grid';

import settings from '../settings.json';
import Holders from '../components/Holders/Holders';
import Wallets from '../components/Wallets/Wallets';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {settings.tokenTicker} - {settings.tokenName} wallets -{' '}
          {settings.globalHtmlTitleSuffix}
        </title>
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Holders />
        </Grid>
        <Grid item xs={12}>
          <Wallets />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
