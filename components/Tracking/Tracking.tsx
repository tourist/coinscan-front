import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { gql } from '@apollo/client';
import combineQuery from 'graphql-combine-query';
import { createColumnHelper } from '@tanstack/react-table';
import { GetWalletsTrackedPaginatedWithTransactionsQuery } from '../../generated/graphql';

import type { Wallet } from '../Wallets/utils';
import SparkBar from '../Charts/SparkBar';
import ColorScale from '../Charts/ColorScale';
import MaterialTable from '../MaterialTable/MaterialTable';
import WalletLink from '../Addresses/WalletLink';
import BalancePercentage from '../Wallets/BalancePercentage';
import { formatValue } from '../../utils/formatters';
import {
  fillMissingDaysInDataPointArray,
  DataPoint,
  convertWalletDailyStatesToDataPointArray,
} from '../../utils/charts';
import { getUnixTime } from '../../utils/time';
import { getNetFlowPercentageFromWallet } from '../Wallets/utils';
import NeutralPlaceholder from '../NeutralPlaceholder';
import AddToTrack from './AddToTrack';
import { getValueOrFirstValueFromRouterQueryParam } from '../../utils/router';

export const GET_WALLETS_TRACKED_PAGINATED = gql`
  query GetWalletsTrackedPaginatedWithTransactions($walletId: ID!) {
    wallet(id: $walletId) {
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

const Tracking = () => {
  const [walletsIds, setWalletsIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const walletIds = getValueOrFirstValueFromRouterQueryParam(
        router?.query?.wallets
      ).split(',');
      setWalletsIds(walletIds);
    }
  }, [router]);

  const { document: combinedQuery, variables } = combineQuery(
    'GetWalletsTrackedPaginatedWithTransactions'
  ).addN(
    GET_WALLETS_TRACKED_PAGINATED,
    walletsIds?.length > 0
      ? walletsIds.map((id) => ({
          walletId: id,
        }))
      : []
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
        id: 'Tracked',
        header: 'Tracked',
        meta: {
          sx: { width: 64, textAlign: 'center' },
        },
        cell: (info) => <AddToTrack />,
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
    <MaterialTable
      columns={defaultColumns}
      query={walletsIds.length > 0 ? combinedQuery : undefined}
      queryProcessResultsFn={(data: {
        [
          key: string
        ]: GetWalletsTrackedPaginatedWithTransactionsQuery['wallet'];
      }) => {
        const processedData = {
          wallets: [
            ...Object.values(data).filter(
              (
                wallet
              ): wallet is NonNullable<
                GetWalletsTrackedPaginatedWithTransactionsQuery['wallet']
              > => wallet !== null && wallet !== undefined
            ),
          ],
        };
        return processedData;
      }}
      variables={variables}
    />
  );
};

export default Tracking;
