import { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import type { GetWalletWithDailyStatesQuery } from '../../generated/graphql';
import WalletTransactions from './WalletTransactions';
import WalletCharts from './WalletCharts';
import WalletDetails from './WalletDetails';

export const GET_WALLET_WITH_DAILY_STATES = gql`
  query GetWalletWithDailyStates($address: ID!) {
    wallet(id: $address) {
      id
      address
      value
      dailyStates(first: 1000, orderBy: start, orderDirection: desc) {
        start
        inflow
        outflow
      }
    }
  }
`;

const Wallet = ({ address }: { address: string }) => {
  const [getWallet, { loading, data }] =
    useLazyQuery<GetWalletWithDailyStatesQuery>(GET_WALLET_WITH_DAILY_STATES, {
      variables: {
        address: address,
      },
    });

  // wait for address from router
  useEffect(() => {
    if (address) {
      getWallet();
    }
  }, [address, getWallet]);

  return (
    <Grid container>
      <Grid container sx={{ py: 4 }}>
        <Grid item xs={12} lg={4}>
          <WalletDetails address={address} data={data} loading={loading} />
        </Grid>
        <Grid item xs={12} lg={8} sx={{ mt: { xs: 3, sm: 0 } }}>
          <Box sx={{ width: '100%', height: 300 }}>
            <WalletCharts loading={loading} data={data} address={address} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WalletTransactions address={address} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Wallet;
