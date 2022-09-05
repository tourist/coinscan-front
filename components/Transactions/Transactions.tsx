import { useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { gql, useQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FilterListIcon from '@mui/icons-material/FilterList';

import {
  OrderDirection,
  GetTransactionsPaginatedQuery,
  Transaction_OrderBy,
  QueryTransactionsArgs,
} from '../../generated/graphql';
import MaterialRemoteTable from '../MaterialRemoteTable';
import TransactionHash from './TransactionHash';
import TransactionHottnessHeader from './TransactionHottnessHeader';
import TransactionHottness from './TransactionHottness';
import WalletLink from '../Addresses/WalletLink';
import {
  fromUnixTime,
  getUnixTime,
  toLocaleStringUTC,
} from '../../utils/charts';
import { formatValue } from '../../utils/formatters';
import Link from '../Link';

const PER_PAGE_DEFAULT = 50;

const GET_TRANSACTIONS_PAGINATED = gql`
  query GetTransactionsPaginated(
    $address: String
    $first: Int!
    $skip: Int!
    $orderBy: Transaction_orderBy!
    $orderDirection: OrderDirection!
    $where: Transaction_filter
  ) {
    transactions(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
      where: $where
    ) {
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
  }
`;

export type Transaction = GetTransactionsPaginatedQuery['transactions'][0];

type TransactionsQueryParams = QueryTransactionsArgs & { page: number };

type TransactionsProps = {
  hot?: boolean;
};

const Transactions = ({ hot }: TransactionsProps) => {
  const timestampFilter = useRef(0);
  if (hot && !timestampFilter.current) {
    timestampFilter.current = getUnixTime(
      dayjs().subtract(30, 'days').toDate()
    );
  }

  let queryParams: TransactionsQueryParams = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: hot ? Transaction_OrderBy.Value : Transaction_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  if (hot) {
    queryParams.where = { timestamp_gt: timestampFilter.current };
  }

  const { loading, data, fetchMore } = useQuery<GetTransactionsPaginatedQuery>(
    GET_TRANSACTIONS_PAGINATED,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        ...queryParams,
      },
    }
  );

  const columnHelper = createColumnHelper<Transaction>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: 'Date',
        meta: {
          sx: {
            width: 100,
          },
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
            width: 400,
          },
        },
        cell: (info) => <WalletLink short walletToLink={info.getValue().id} />,
      }),
      columnHelper.accessor('to', {
        header: 'To',
        meta: {
          sx: {
            width: 300,
          },
        },
        cell: (info) => <WalletLink short walletToLink={info.getValue().id} />,
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => formatValue(info.getValue()),
      }),
    ],
    [columnHelper]
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <ButtonGroup
          sx={{
            width: { xs: '100%', sm: 'auto' },
            mb: { xs: 2, sm: 0 },
            a: {
              width: {
                xs: '50%',
                sm: 'auto',
              },
              fontSize: {
                xs: '0.8rem',
                sm: 'button.fontSize',
              },
            },
          }}
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button href="/transactions" component={Link} disabled={!hot}>
            All Transactions
          </Button>
          <Button href="/transactions/hot" component={Link} disabled={hot}>
            Hot transactions (90d)
          </Button>
        </ButtonGroup>
      </Box>
      <MaterialRemoteTable
        data={(data && data.transactions) || []}
        loading={loading}
        columns={defaultColumns}
        fetchMore={fetchMore}
        globalFilterHidden
        perPage={PER_PAGE_DEFAULT}
      />
    </Box>
  );
};

export default Transactions;
