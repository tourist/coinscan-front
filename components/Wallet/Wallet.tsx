import { gql, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import type { GetWalletWithDailyStatesQuery } from '../../generated/graphql';
import WalletTransactions, { TRANSACTION_FIELDS } from './WalletTransactions';
import WalletCharts from './WalletCharts';
import WalletDetails from './WalletDetails';

export const GET_WALLET_WITH_DAILY_STATES = gql`
  ${TRANSACTION_FIELDS}
  query GetWalletWithDailyStates($address: ID!) {
    wallet(id: $address) {
      id
      address
      value
      dailyStates(first: 90, orderBy: start, orderDirection: desc) {
        start
        inflow
        outflow
      }
    }
  }
`;

const Wallet = ({ address }: { address: string }) => {
  const { loading, data } = useQuery<GetWalletWithDailyStatesQuery>(
    GET_WALLET_WITH_DAILY_STATES,
    {
      variables: {
        address: address,
      },
    }
  );

  return (
    <Grid container>
      <Grid container sx={{ py: 4 }}>
        <Grid item xs={12} md={4}>
          <WalletDetails address={address} data={data} loading={loading} />
        </Grid>
        <Grid item xs={12} md={8} sx={{ mt: { xs: 3, sm: 0 } }}>
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
