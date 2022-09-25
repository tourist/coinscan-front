import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  OrderDirection,
  GetWalletTransactionsPaginatedQuery,
  WalletTransaction_OrderBy,
  GetWalletTransactionsPaginatedQueryVariables,
} from '../../generated/graphql';
import { fromUnixTime, toLocaleStringUTC } from '../../utils/time';
import { formatValue } from '../../utils/formatters';
import MaterialTable from '../MaterialTable/MaterialTable';
import TransactionDirection from '../Transactions/TransactionDirection';
import TransactionHash from '../Transactions/TransactionHash';
import TransactionHottnessHeader from '../Transactions/TransactionHottnessHeader';
import TransactionHottness from '../Transactions/TransactionHottness';
import WalletLink from '../Addresses/WalletLink';

const PER_PAGE_DEFAULT = 10;

export const GET_WALLET_TRANSACTIONS_PAGINATED = gql`
  query GetWalletTransactionsPaginated(
    $id: ID
    $first: Int!
    $skip: Int!
    $orderBy: WalletTransaction_orderBy!
    $orderDirection: OrderDirection!
    $where: WalletTransaction_filter
  ) {
    walletTransactions(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
      where: $where
    ) {
      transaction {
        id
        txn
        timestamp
        from {
          address
        }
        to {
          address
        }
        value
      }
      value
      timestamp
    }
  }
`;

type WalletTransactionsProps = {
  address?: string;
};

const WalletTransactions = ({ address }: WalletTransactionsProps) => {
  let queryParams: GetWalletTransactionsPaginatedQueryVariables & {
    page: number;
  } = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: WalletTransaction_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  queryParams.where = { wallet: address };

  const columnHelper =
    createColumnHelper<
      GetWalletTransactionsPaginatedQuery['walletTransactions'][0]
    >();

  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: 'Date',
        meta: {
          sx: { width: 100 },
        },
        cell: (info) =>
          toLocaleStringUTC(fromUnixTime(Number(info.getValue()))),
      }),
      columnHelper.accessor('value', {
        id: 'hottness',
        header: () => <TransactionHottnessHeader />,
        cell: (info) => <TransactionHottness value={Number(info.getValue())} />,
        meta: {
          sx: {
            width: 60,
            '& > div': {
              margin: '0 auto',
            },
          },
        },
      }),
      columnHelper.accessor('transaction.txn', {
        header: 'Txn',
        meta: {
          sx: {
            width: 400,
          },
        },
        cell: (info) => <TransactionHash short txn={info.getValue()} />,
      }),
      columnHelper.accessor('transaction.from', {
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
            walletToLink={info.getValue().address}
          />
        ),
      }),
      columnHelper.accessor('transaction.from', {
        id: 'direction',
        header: '',
        meta: {
          sx: {
            width: 80,
          },
        },
        cell: (info) => {
          return (
            <TransactionDirection
              incoming={address !== info.getValue().address}
            />
          );
        },
      }),
      columnHelper.accessor('transaction.to', {
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
            walletToLink={info.getValue().address}
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
      <MaterialTable
        columns={defaultColumns}
        query={GET_WALLET_TRANSACTIONS_PAGINATED}
        variables={{
          ...queryParams,
        }}
        perPage={PER_PAGE_DEFAULT}
      />
    </Box>
  );
};

export default WalletTransactions;
