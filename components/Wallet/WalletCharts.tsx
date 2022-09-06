import { useState } from 'react';
import pipe from 'lodash/fp/pipe';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Skeleton from '@mui/material/Skeleton';

import type {
  GetWalletWithDailyStatesQuery,
  TransactionFragmentFragment,
  DailyWalletState,
} from '../../generated/graphql';
import {
  fillMissingDaysInDataPointArray,
  groupDataSumByDays,
  calculateHistoryBalanceFromTransactions,
  convertToChartableData,
  getUnixTime,
  DataPoint,
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

  const walletData = data?.wallet;
  let currentChart = null;

  if (walletData) {
    const chartDataFromWalletDailyStatesByDays = pipe([
      (data: DailyWalletState[]) =>
        convertWalletDailyStatesToDataPointArray(data),
      groupDataSumByDays,
      (data: DataPoint<bigint>[]) => fillMissingDaysInDataPointArray(data, 90),
    ])(walletData.dailyStates);

    const charts = {
      [WalletChartsTypes.NETFLOW]: (
        <WalletTransactionsInOutChart
          chartData={convertToChartableData(
            chartDataFromWalletDailyStatesByDays
          )}
        />
      ),
      [WalletChartsTypes.BALANCE]: (
        <WalletBalanceChart
          chartData={convertToChartableData(
            calculateHistoryBalanceFromTransactions(
              chartDataFromWalletDailyStatesByDays,
              BigInt(walletData.value)
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
