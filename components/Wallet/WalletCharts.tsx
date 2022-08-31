import { useState } from 'react';
import pipe from 'lodash/fp/pipe';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Skeleton from '@mui/material/Skeleton';

import type {
  GetWalletTransactionsQuery,
  TransactionFragmentFragment,
} from '../../generated/graphql';
import {
  convertTransactionsArrayToDataPointArray,
  fillMissingDaysInDataPointArray,
  groupDataSumByDays,
  calculateHistoryBalanceFromTransactions,
  convertToChartableData,
  getUnixTime,
  DataPoint,
} from '../../utils/charts';
import WalletBalanceChart from './WalletBalanceChart';
import WalletTransactionsInOutChart from './WalletTransactionsInOutChart';
import dayjs from 'dayjs';

type WalletChartsProps = {
  data?: GetWalletTransactionsQuery;
  address: string;
  balance?: bigint;
  loading?: boolean;
};

export enum WalletChartsTypes {
  NETFLOW,
  BALANCE,
}

const WalletCharts = ({ data, loading }: WalletChartsProps) => {
  const [visibleChart, setVisibleChart] = useState<WalletChartsTypes>(
    WalletChartsTypes.NETFLOW
  );

  const ninetyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(90, 'days').toDate()
  );

  let mergedTransactions: TransactionFragmentFragment[] = [];
  const walletData = data?.wallet;
  let currentChart = null;

  if (walletData) {
    mergedTransactions = [
      ...walletData.transactionsTo.filter(
        (t) => t.timestamp > ninetyDaysAgoTimestamp
      ),
      ...walletData.transactionsFrom.filter(
        (t) => t.timestamp > ninetyDaysAgoTimestamp
      ),
    ].sort((a, b) => b.timestamp - a.timestamp);

    const chartDataFromTransactionsByDays = pipe([
      (data: TransactionFragmentFragment[]) =>
        convertTransactionsArrayToDataPointArray(data, walletData.address),
      groupDataSumByDays,
      (data: DataPoint<bigint>[]) => fillMissingDaysInDataPointArray(data, 90),
    ])(mergedTransactions);

    const charts = {
      [WalletChartsTypes.NETFLOW]: (
        <WalletTransactionsInOutChart
          chartData={convertToChartableData(chartDataFromTransactionsByDays)}
        />
      ),
      [WalletChartsTypes.BALANCE]: (
        <WalletBalanceChart
          chartData={convertToChartableData(
            calculateHistoryBalanceFromTransactions(
              chartDataFromTransactionsByDays,
              walletData.value
            )
          )}
        />
      ),
    };

    currentChart = charts[visibleChart];
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end' }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            disabled={visibleChart === WalletChartsTypes.NETFLOW}
            onClick={() => setVisibleChart(WalletChartsTypes.NETFLOW)}
          >
            Netflow (90d)
          </Button>
          <Button
            disabled={visibleChart === WalletChartsTypes.BALANCE}
            onClick={() => setVisibleChart(WalletChartsTypes.BALANCE)}
          >
            Balance (90d)
          </Button>
        </ButtonGroup>
      </Box>
      {loading ? (
        <Skeleton
          component="div"
          sx={{ transform: 'none', height: 300 }}
          width="100%"
        />
      ) : (
        currentChart
      )}
    </Box>
  );
};

export default WalletCharts;
