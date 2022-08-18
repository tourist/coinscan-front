import { useMemo } from 'react';
import dayjs from 'dayjs';
import { gql, useQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import {
  QueryWalletsArgs,
  OrderDirection,
  Wallet_OrderBy,
  GetWalletsPaginatedWithTransactionsQuery,
} from '../../generated/graphql';

import ColorScale from '../ColorScale';
import MaterialRemoteTable, { PER_PAGE_DEFAULT } from '../MaterialRemoteTable';
import WalletLink from '../WalletLink';
import BalancePercentage from './BalancePercentage';
import { formatValue } from '../../utils/formatters';
import { TRANSACTION_FIELDS } from './WalletTransactions';
import { getUnixTime } from '../Holders/utils';

type WalletsPaginatedVars = QueryWalletsArgs & { page: number };

export const GET_WALLETS_PAGINATED = gql`
  ${TRANSACTION_FIELDS}
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
      transactionsTo(
        first: 1000
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_gt: 1657869421 }
      ) {
        ...TransactionFragment
      }
      transactionsFrom(
        first: 1000
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_gt: 1657869421 }
      ) {
        ...TransactionFragment
      }
    }
  }
`;

export type Wallet = NonNullable<
  GetWalletsPaginatedWithTransactionsQuery['wallets']
>[0];

function getNetFlowPercentageFromWallet(
  wallet: Wallet,
  timestamp: number
): number {
  let percent = 0;

  const positiveFlow = wallet.transactionsTo.reduce((acc, transaction) => {
    if (Number(transaction.timestamp) >= timestamp) {
      return acc + BigInt(transaction.value);
    }
    return acc;
  }, BigInt(0));

  const negativeFlow = wallet.transactionsFrom.reduce((acc, transaction) => {
    if (Number(transaction.timestamp) >= timestamp) {
      return acc + BigInt(transaction.value);
    }
    return acc;
  }, BigInt(0));

  const preTransactionWalletBalance =
    BigInt(wallet.value) - positiveFlow + negativeFlow;

  // clamp bar width to max 100% (show real value as text only)
  if (preTransactionWalletBalance === BigInt(0)) {
    if (wallet.value > BigInt(0)) {
      percent = 100;
    } else {
      percent = 0;
    }
  } else {
    const first = Number(
      (BigInt(wallet.value) * BigInt(100)) / preTransactionWalletBalance
    );
    percent = first - 100;
  }

  return Number(percent);
}

const NetFlowNeutral = () => <Box sx={{ textAlign: 'center' }}>-</Box>;

const Wallets = () => {
  const queryParams: WalletsPaginatedVars = {
    first: PER_PAGE_DEFAULT,
    skip: 0,
    orderBy: Wallet_OrderBy.Value,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };

  const { loading, error, data, fetchMore } =
    useQuery<GetWalletsPaginatedWithTransactionsQuery>(GET_WALLETS_PAGINATED, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        ...queryParams,
        address: '',
      },
    });

  const columnHelper = createColumnHelper<Wallet>();
  const oneDayAgoTimestamp = getUnixTime(dayjs().subtract(1, 'days').toDate());
  const sevenDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(7, 'days').toDate()
  );
  const thirtyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(30, 'days').toDate()
  );
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
        cell: (info) => (
          <WalletLink walletToLink={info.getValue()} scannerLink />
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
            <NetFlowNeutral />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'netBalance7days',
        header: 'Net balance (7 days)',
        cell: (info) => {
          const percent = getNetFlowPercentageFromWallet(
            info.row.original,
            sevenDaysAgoTimestamp
          );
          return percent ? (
            <ColorScale id={`${info.row.index}-7`} data={percent} />
          ) : (
            <NetFlowNeutral />
          );
        },
      }),
      columnHelper.accessor('value', {
        id: 'netBalance30days',
        header: 'Net balance (30 days)',
        cell: (info) => {
          const percent = getNetFlowPercentageFromWallet(
            info.row.original,
            thirtyDaysAgoTimestamp
          );
          return percent ? (
            <ColorScale id={`${info.row.index}-30`} data={percent} />
          ) : (
            <NetFlowNeutral />
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
    ],
    [
      columnHelper,
      oneDayAgoTimestamp,
      sevenDaysAgoTimestamp,
      thirtyDaysAgoTimestamp,
    ]
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
