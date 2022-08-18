import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import {
  OrderDirection,
  GetTransactionsPaginatedQuery,
  Transaction_OrderBy,
  QueryTransactionsArgs,
} from '../../generated/graphql';

import MaterialRemoteTable from '../MaterialRemoteTable';
import TransactionHash from '../TransactionHash';
import WalletLink from '../WalletLink';
import { fromUnixTime, toLocaleStringUTC } from '../Holders/utils';
import { formatValue } from '../../utils/formatters';

type TransactionsPaginatedVars = QueryTransactionsArgs & { page: number };

const PER_PAGE_DEFAULT = 50;

const GET_TRANSACTIONS_PAGINATED = gql`
  query GetTransactionsPaginated(
    $address: String
    $first: Int!
    $skip: Int!
    $orderBy: Transaction_orderBy!
    $orderDirection: OrderDirection!
  ) {
    transactions(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
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

export type Transaction = NonNullable<
  GetTransactionsPaginatedQuery['transactions']
>[0];

const Transactions = () => {
  const queryParams: TransactionsPaginatedVars = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: Transaction_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  const { loading, error, data, fetchMore } =
    useQuery<GetTransactionsPaginatedQuery>(GET_TRANSACTIONS_PAGINATED, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        ...queryParams,
        address: '',
      },
    });

  const columnHelper = createColumnHelper<Transaction>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: 'Date',
        cell: (info) => toLocaleStringUTC(fromUnixTime(info.getValue())),
      }),
      columnHelper.accessor('txn', {
        header: 'Txn',
        cell: (info) => <TransactionHash short txn={info.getValue()} />,
      }),
      columnHelper.accessor('from', {
        header: 'From',
        cell: (info) => <WalletLink short walletToLink={info.getValue().id} />,
      }),
      columnHelper.accessor('to', {
        header: 'To',
        cell: (info) => <WalletLink short walletToLink={info.getValue().id} />,
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => formatValue(info.getValue()),
      }),
    ],
    [columnHelper]
  );

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <MaterialRemoteTable
      data={(data && data.transactions) || []}
      loading={loading}
      columns={defaultColumns}
      fetchMore={fetchMore}
      globalFilterHidden
      perPage={PER_PAGE_DEFAULT}
    />
  );
};

export default Transactions;
