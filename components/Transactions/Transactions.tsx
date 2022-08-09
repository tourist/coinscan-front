import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import {
  OrderDirection,
  GetTransactionsPaginatedQuery,
  Transaction_OrderBy,
  QueryTransactionsArgs,
} from '../../generated/graphql';
import { createColumnHelper } from '@tanstack/react-table';
import MaterialRemoteTable, { PER_PAGE_DEFAULT } from '../MaterialRemoteTable';
import Address from '../Address';
import WalletLink from '../WalletLink';
import { fromUnixTime, toLocaleStringUTC } from '../HoldersChart/utils';
import settings from '../../settings.json';

type TransactionsPaginatedVars = QueryTransactionsArgs & { page: number };

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
        cell: (info) => <Address short address={info.getValue()} />,
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
        cell: (info) =>
          utils.formatUnits(info.getValue(), settings.decimalPlaces),
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
    />
  );
};

export default Transactions;
