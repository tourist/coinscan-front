import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import {
  QueryWalletsArgs,
  OrderDirection,
  Wallet_OrderBy,
  GetWalletsPaginatedWithTransactionsQuery,
} from '../../generated/graphql';

import type { Wallet } from './utils';
import SparkBar from '../Charts/SparkBar';
import ColorScale from '../Charts/ColorScale';
import MaterialRemoteTable, { PER_PAGE_DEFAULT } from '../MaterialRemoteTable';
import WalletLink from '../Addresses/WalletLink';
import BalancePercentage from './BalancePercentage';
import { formatValue } from '../../utils/formatters';
import {
  getUnixTime,
  fillMissingDaysInDataPointArray,
  DataPoint,
  convertWalletDailyStatesToDataPointArray,
} from '../../utils/charts';
import { getNetFlowPercentageFromWallet } from './utils';
import NeutralPlaceholder from '../NeutralPlaceholder';

type WalletsPaginatedVars = QueryWalletsArgs & { page: number };

export const GET_WALLETS_PAGINATED = gql`
  query GetWalletsPaginatedWithTransactions(
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
      dailyStates(first: 30, orderBy: start, orderDirection: desc) {
        start
        inflow
        outflow
      }
    }
  }
`;

const Wallets = () => {
  const router = useRouter();
  const queryParams: WalletsPaginatedVars = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: Wallet_OrderBy.Value,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  const [getWallets, { called, loading, data, fetchMore }] =
    useLazyQuery<GetWalletsPaginatedWithTransactionsQuery>(
      GET_WALLETS_PAGINATED,
      {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
        variables: {
          ...queryParams,
          address: '',
        },
      }
    );

  const oneDayAgoTimestamp = getUnixTime(
    dayjs().subtract(1, 'days').startOf('day').toDate()
  );

  const sevenDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(7, 'days').startOf('day').toDate()
  );
  const thirtyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(30, 'days').startOf('day').toDate()
  );

  const columnHelper = createColumnHelper<Wallet>();

  const defaultColumns = useMemo(() => {
    const netBalanceCellsMeta = { sx: { px: 0 } };
    return [
      columnHelper.display({
        id: 'Rank',
        header: 'Rank',
        meta: {
          sx: { width: 64 },
        },
        cell: (info) => {
          const page: number = info.table.getState().pagination.pageIndex + 1;
          const perPage: number = info.table.getState().pagination.pageSize;
          return page && perPage
            ? perPage * (page - 1) + info.row.index + 1
            : info.row.index;
        },
      }),
      columnHelper.accessor('address', {
        header: 'Wallet',
        meta: {
          sx: { width: 300 },
        },
        cell: (info) => (
          <WalletLink walletToLink={info.getValue()} scannerLink short />
        ),
      }),
      columnHelper.accessor('value', {
        id: 'netBalance1day',
        header: 'Net balance (1 day)',
        cell: (info) => {
          const percent = getNetFlowPercentageFromWallet(
            info.row.original,
            oneDayAgoTimestamp
          );
          return percent ? (
            <ColorScale id={`${info.row.index}-1`} data={percent} />
          ) : (
            <NeutralPlaceholder />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'netBalance7days',
        header: 'Net balance (7 days)',
        meta: netBalanceCellsMeta,
        cell: (info) => {
          const percent = getNetFlowPercentageFromWallet(
            info.row.original,
            sevenDaysAgoTimestamp
          );
          return percent ? (
            <ColorScale id={`${info.row.index}-7`} data={percent} />
          ) : (
            <NeutralPlaceholder />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'netBalance30days',
        header: 'Net balance (30 days)',
        meta: netBalanceCellsMeta,
        cell: (info) => {
          const percent = getNetFlowPercentageFromWallet(
            info.row.original,
            thirtyDaysAgoTimestamp
          );
          return percent ? (
            <ColorScale id={`${info.row.index}-30`} data={percent} />
          ) : (
            <NeutralPlaceholder />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'transactionsLast30Days',
        header: 'Transactions in/out (30 days)',
        meta: netBalanceCellsMeta,
        cell: (info) => {
          const data: DataPoint<bigint>[] =
            info.row.original.dailyStates &&
            info.row.original.dailyStates.length > 0
              ? fillMissingDaysInDataPointArray(
                  convertWalletDailyStatesToDataPointArray(
                    info.row.original.dailyStates
                  ),
                  30
                )
              : [];
          return data && data.length > 0 ? (
            <SparkBar id={`${info.row.index}-sb-30`} data={data} />
          ) : (
            <NeutralPlaceholder />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'percent',
        header: 'Percent of supply',
        cell: (info) => <BalancePercentage balance={info.getValue()} />,
      }),
      columnHelper.accessor('value', {
        header: 'Amount',
        cell: (info) => formatValue(info.getValue()),
      }),
    ];
  }, [
    columnHelper,
    oneDayAgoTimestamp,
    sevenDaysAgoTimestamp,
    thirtyDaysAgoTimestamp,
  ]);
  return (
    <MaterialRemoteTable
      columns={defaultColumns}
      query={GET_WALLETS_PAGINATED}
      variables={{
        ...queryParams,
        address: '',
      }}
      globalFilterField="address"
      globalFilterSearchLabel="Search wallet"
    />
  );
};

export default Wallets;
