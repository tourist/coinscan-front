import Head from 'next/head';
import Grid from '@mui/material/Grid';

import { GetWalletsPaginatedWithTransactionsQuery } from '../generated/graphql';
import settings from '../settings.json';
import Holders from '../components/Holders/Holders';
import Wallets, {
  queryParams,
  GET_WALLETS_PAGINATED,
} from '../components/Wallets/Wallets';
import createApolloClient from '../utils/apolloClient';

export async function getStaticProps() {
  const client = createApolloClient(() => {});
  const { data } = await client.query({
    query: GET_WALLETS_PAGINATED,
    variables: {
      ...queryParams,
      address: '',
    },
    fetchPolicy: 'network-only',
  });

  return {
    props: {
      data,
    },
    revalidate: 10, // In seconds
  };
}

const Home = ({ data }: { data: GetWalletsPaginatedWithTransactionsQuery }) => {
  return (
    <>
      <Head>
        <title>
          {`${settings.tokenTicker} - ${settings.tokenName} wallets - ${settings.globalHtmlTitleSuffix}`}
        </title>
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Holders />
        </Grid>
        <Grid item xs={12}>
          <Wallets data={data} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
