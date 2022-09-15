import { useState } from 'react';
import dayjs from 'dayjs';
import pipe from 'lodash/fp/pipe';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Skeleton from '@mui/material/Skeleton';

import type {
  GetWalletWithDailyStatesQuery,
  DailyWalletState,
} from '../../generated/graphql';
import type { DataPoint, DataPointWithDisplay } from '../../utils/charts';
import {
  fillMissingDaysInDataPointArray,
  calculateHistoryBalanceFromTransactions,
  convertToChartableData,
  convertWalletDailyStatesToDataPointArray,
} from '../../utils/charts';
import WalletBalanceChart from './WalletBalanceChart';
import WalletTransactionsInOutChart from './WalletTransactionsInOutChart';

type WalletChartsProps = {
  data?: GetWalletWithDailyStatesQuery;
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

  let currentChart: React.ReactNode;

  const walletData = data?.wallet;
  if (!walletData) return null;

  const firstDailyState = dayjs.unix(
    parseInt(
      walletData.dailyStates[walletData.dailyStates.length - 1].start,
      10
    )
  );
  const daysFromFirstStateForBalanceChart =
    Math.abs(firstDailyState.diff(dayjs(Date.now()), 'days')) + 1;

  const chartDataFromWalletDailyStatesByDays = pipe([
    (data: DailyWalletState[]) =>
      convertWalletDailyStatesToDataPointArray(data),
    (data: DataPoint<bigint>[]) =>
      fillMissingDaysInDataPointArray(
        data,
        visibleChart === WalletChartsTypes.BALANCE
          ? daysFromFirstStateForBalanceChart
          : 90
      ),
  ])(walletData.dailyStates);

  let chartData: DataPointWithDisplay<bigint>[];

  switch (visibleChart) {
    case WalletChartsTypes.NETFLOW:
      chartData = convertToChartableData(chartDataFromWalletDailyStatesByDays);
      currentChart = <WalletTransactionsInOutChart chartData={chartData} />;
      break;

    case WalletChartsTypes.BALANCE:
      chartData = convertToChartableData(
        calculateHistoryBalanceFromTransactions(
          chartDataFromWalletDailyStatesByDays,
          BigInt(walletData.value)
        )
      );
      currentChart = <WalletBalanceChart chartData={chartData} />;
      break;
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end' }}>
        <ButtonGroup aria-label="choose chart variant for wallet holdings">
          <Button
            variant={
              visibleChart === WalletChartsTypes.NETFLOW
                ? 'contained'
                : 'outlined'
            }
            onClick={() => setVisibleChart(WalletChartsTypes.NETFLOW)}
          >
            Netflow (90d)
          </Button>
          <Button
            variant={
              visibleChart === WalletChartsTypes.BALANCE
                ? 'contained'
                : 'outlined'
            }
            onClick={() => setVisibleChart(WalletChartsTypes.BALANCE)}
          >
            Balance history
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
