import { gql, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import type { GetWalletTransactionsQuery } from '../../generated/graphql';
import WalletTransactions from '../../components/Wallets/WalletTransactions';
import { TRANSACTION_FIELDS } from '../Wallets/WalletTransactions';
import WalletCharts from './WalletCharts';
import WalletDetails from './WalletDetails';

export const GET_WALLET_WITH_TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  query GetWalletTransactions($address: ID!) {
    wallet(id: $address) {
      id
      address
      value
      transactionsTo(first: 1000, orderBy: timestamp, orderDirection: desc) {
        ...TransactionFragment
      }
      transactionsFrom(first: 1000, orderBy: timestamp, orderDirection: desc) {
        ...TransactionFragment
      }
    }
  }
`;

const Wallet = ({ address }: { address: string }) => {
  const { loading, data } = useQuery<GetWalletTransactionsQuery>(
    GET_WALLET_WITH_TRANSACTIONS,
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
        <Grid item xs={12} md={8} sx={{ pb: { xs: 3 } }}>
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
