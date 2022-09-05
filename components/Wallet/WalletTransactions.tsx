import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  GetWalletTransactionsQuery,
  TransactionFragmentFragment,
} from '../../generated/graphql';
import { fromUnixTime, toLocaleStringUTC } from '../../utils/charts';
import TransactionHash from '../TransactionHash';
import MaterialRemoteTable from '../MaterialRemoteTable';
import TransactionHottnessHeader from '../TransactionHottnessHeader';
import TransactionHottness from '../TransactionHottness';
import WalletLink from '../WalletLink';
import TransactionDirection from '../TransactionDirection';
import { formatValue } from '../../utils/formatters';

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFragment on Transaction {
    id
    txn
    timestamp
    from {
      id
      address
    }
    to {
      id
      address
    }
    value
  }
`;

const GET_WALLET_TRANSACTIONS = gql`
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

type WalletTransactionsProps = {
  address?: string;
};

const WalletTransactions = ({ address }: WalletTransactionsProps) => {
  const { data, loading } = useQuery<GetWalletTransactionsQuery>(
    GET_WALLET_TRANSACTIONS,
    {
      variables: {
        address: address,
      },
    }
  );

  let processedData: TransactionFragmentFragment[] = useMemo(
    () =>
      data?.wallet
        ? [...data.wallet.transactionsTo, ...data.wallet.transactionsFrom].sort(
            (a, b) => b.timestamp - a.timestamp
          )
        : [],
    [data]
  );

  const columnHelper = createColumnHelper<TransactionFragmentFragment>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: 'Date',
        meta: {
          sx: { width: 100 },
        },
        cell: (info) => toLocaleStringUTC(fromUnixTime(info.getValue())),
      }),
      columnHelper.accessor('value', {
        id: 'hottness',
        header: () => <TransactionHottnessHeader />,
        cell: (info) => <TransactionHottness value={info.getValue()} />,
        meta: {
          sx: {
            width: 60,
            '& > div': {
              margin: '0 auto',
            },
          },
        },
      }),
      columnHelper.accessor('txn', {
        header: 'Txn',
        meta: {
          sx: {
            width: 400,
          },
        },
        cell: (info) => <TransactionHash short txn={info.getValue()} />,
      }),
      columnHelper.accessor('from', {
        header: 'From',
        meta: {
          sx: {
            width: 300,
          },
        },
        cell: (info) => (
          <WalletLink
            short
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('from', {
        id: 'direction',
        header: '',
        meta: {
          sx: {
            width: 80,
          },
        },
        cell: (info) => {
          return (
            <TransactionDirection incoming={address !== info.getValue().id} />
          );
        },
      }),
      columnHelper.accessor('to', {
        header: 'To',
        meta: {
          sx: {
            width: 300,
          },
        },
        cell: (info) => (
          <WalletLink
            short
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => formatValue(info.getValue()),
      }),
    ],
    [columnHelper, address]
  );

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h5">Wallet Transactions</Typography>
      <MaterialRemoteTable
        data={processedData}
        loading={loading}
        columns={defaultColumns}
        globalFilterHidden
      />
    </Box>
  );
};

export default WalletTransactions;
