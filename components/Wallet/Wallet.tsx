import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import type { GetWalletTransactionsQuery } from '../../generated/graphql';
import { formatValue } from '../../utils/formatters';
import { getUnixTime } from '../Holders/utils';
import { Loading } from '../../components/Wallets/Wallets.styled';
import WalletTransactions from '../../components/Wallets/WalletTransactions';
import { GrowthPercent } from '../Growth';
import settings from '../../settings.json';
import CopyToClipboard from '../CopyToClipboard';
import ChainScannerLink from '../ChainScannerLink';
import { getNetFlowPercentageFromWallet } from '../Wallets/utils';
import { TRANSACTION_FIELDS, Transaction } from '../Wallets/WalletTransactions';
import WalletHeaderCharts from './WalletHeaderCharts';

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
  const walletData = data?.wallet;

  if (loading) return <Loading>Loading...</Loading>;

  const oneDayAgoTimestamp = getUnixTime(dayjs().subtract(1, 'days').toDate());
  const sevenDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(7, 'days').toDate()
  );
  const thirtyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(30, 'days').toDate()
  );
  const ninetyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(90, 'days').toDate()
  );

  let mergedTransactions: Transaction[] = [];

  if (walletData) {
    mergedTransactions = [
      ...walletData.transactionsTo.filter(
        (t) => t.timestamp > ninetyDaysAgoTimestamp
      ),
      ...walletData.transactionsFrom.filter(
        (t) => t.timestamp > ninetyDaysAgoTimestamp
      ),
    ].sort((a, b) => b.timestamp - a.timestamp);
  }
  return (
    <Grid container>
      <Grid container sx={{ py: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{ mr: 1.5, fontSize: { xs: '0.85rem', sm: '1.1rem' } }}
            >
              {address}
            </Typography>
            <CopyToClipboard text={address} />
            <Box sx={{ ml: 1.5 }}>
              <ChainScannerLink
                title={address}
                link={`${settings.scannerAddressLink}${address}`}
              />
            </Box>
          </Box>
          {settings.addresses[address] ? (
            <Typography sx={{ mt: 1 }}>
              Recognized owner:{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 'fontWeightBold',
                }}
              >
                {settings.addresses[address]}
              </Typography>
            </Typography>
          ) : null}
          <Box
            sx={{
              my: 2,
            }}
          >
            <Typography>
              Balance:{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 'fontWeightBold',
                }}
              >
                {formatValue(data?.wallet?.value)}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {data?.wallet ? (
              <>
                <GrowthPercent
                  value={getNetFlowPercentageFromWallet(
                    data.wallet,
                    oneDayAgoTimestamp
                  )}
                  text="1d"
                />
                <GrowthPercent
                  value={getNetFlowPercentageFromWallet(
                    data.wallet,
                    sevenDaysAgoTimestamp
                  )}
                  text="7d"
                />
                <GrowthPercent
                  value={getNetFlowPercentageFromWallet(
                    data.wallet,
                    thirtyDaysAgoTimestamp
                  )}
                  text="30d"
                />
                <GrowthPercent
                  value={getNetFlowPercentageFromWallet(
                    data.wallet,
                    ninetyDaysAgoTimestamp
                  )}
                  text="90d"
                />
              </>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={8} sx={{ pb: { xs: 3 } }}>
          <Box sx={{ width: '100%', height: 300 }}>
            {walletData ? (
              <WalletHeaderCharts
                transactions={mergedTransactions}
                address={walletData.address}
                balance={BigInt(walletData.value)}
              />
            ) : null}
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
