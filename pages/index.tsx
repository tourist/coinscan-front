import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import Grid from '@mui/material/Grid';

import {
  GetWalletsPaginatedWithTransactionsQuery,
  DailyHoldersStatesQuery,
} from '../generated/graphql';
import settings from '../settings.json';
import Holders from '../components/Holders/Holders';
import Wallets, {
  queryParams,
  GET_WALLETS_PAGINATED,
} from '../components/Wallets/Wallets';
import { GET_DAILY_HOLDERS } from '../components/Holders/Holders';
import createApolloClient from '../utils/apolloClient';

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const client = createApolloClient(() => {});
  const [{ data: walletsData }, { data: holdersData }] = await Promise.all([
    client.query<GetWalletsPaginatedWithTransactionsQuery>({
      query: GET_WALLETS_PAGINATED,
      variables: {
        ...queryParams,
        address: '',
      },
      fetchPolicy: 'network-only',
    }),
    client.query<DailyHoldersStatesQuery>({
      query: GET_DAILY_HOLDERS,
    }),
  ]);

  return {
    props: {
      holdersData: holdersData,
      walletsData: walletsData,
    },
  };
};

export const Home = ({
  holdersData,
  walletsData,
}: {
  holdersData?: DailyHoldersStatesQuery;
  walletsData?: GetWalletsPaginatedWithTransactionsQuery;
}) => {
  return (
    <>
      <Head>
        <title>
          {`${settings.tokenTicker} - ${settings.tokenName} wallets - ${settings.globalHtmlTitleSuffix}`}
        </title>
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Holders data={holdersData} />
        </Grid>
        <Grid item xs={12}>
          <Wallets data={walletsData} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
