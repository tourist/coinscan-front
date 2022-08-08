import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import {
  QueryWalletsArgs,
  OrderDirection,
  Wallet_OrderBy,
  GetWalletsPaginatedQuery,
} from '../../generated/graphql';
import { createColumnHelper } from '@tanstack/react-table';
import MaterialRemoteTable, { PER_PAGE_DEFAULT } from '../MaterialRemoteTable';
import WalletLink from './WalletLink';
import BalancePercentage from './BalancePercentage';

type WalletsPaginatedVars = QueryWalletsArgs & { page: number };

const GET_WALLETS_PAGINATED = gql`
  query GetWalletsPaginated(
    $address: String!
    $first: Int!
    $skip: Int!
    $orderBy: Wallet_orderBy!
    $orderDirection: OrderDirection!
  ) {
    wallets(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
      where: { address_contains_nocase: $address }
    ) {
      address
      value
    }
  }
`;

export type Wallet = NonNullable<GetWalletsPaginatedQuery['wallets']>[0];

const Wallets = () => {
  const queryParams: WalletsPaginatedVars = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: Wallet_OrderBy.Value,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  const { loading, error, data, fetchMore } =
    useQuery<GetWalletsPaginatedQuery>(GET_WALLETS_PAGINATED, {
      notifyOnNetworkStatusChange: true,
      variables: {
        ...queryParams,
        address: '',
      },
    });

  const columnHelper = createColumnHelper<Wallet>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.display({
        id: 'Rank',
        header: 'Rank',
        cell: (info) => {
          const page: number = info.table.getState().pagination.pageIndex + 1;
          const perPage: number = info.table.getState().pagination.pageSize;
          return page && perPage
            ? perPage * (page - 1) + info.row.index + 1
            : info.row.index;
        },
      }),
      columnHelper.accessor('address', {
        header: 'To',
        cell: (info) => <WalletLink walletToLink={info.getValue()} />,
      }),
      columnHelper.accessor('value', {
        id: 'percent',
        header: 'Percent of supply',
        cell: (info) => <BalancePercentage balance={info.getValue()} />,
      }),
      columnHelper.accessor('value', {
        header: 'Amount',
        cell: (info) => utils.formatUnits(info.getValue(), 8),
      }),
    ],
    [columnHelper]
  );

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <MaterialRemoteTable
      data={(data && data.wallets) || []}
      loading={loading}
      columns={defaultColumns}
      fetchMore={fetchMore}
      globalFilterField="address"
      globalFilterSearchLabel="Search wallet"
    />
  );
};

export default Wallets;
