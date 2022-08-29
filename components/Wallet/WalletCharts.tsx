import { ReactNode, useState } from 'react';
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
  convertValuesToNumber,
  getUnixTime,
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

    const getBalanceChartData = convertValuesToNumber(
      calculateHistoryBalanceFromTransactions(
        fillMissingDaysInDataPointArray(
          groupDataSumByDays(
            convertTransactionsArrayToDataPointArray(
              mergedTransactions,
              walletData.address
            )
          ),
          90
        ),
        walletData.value
      )
    );
    const chartNetTransactionsPerDayData = convertValuesToNumber(
      fillMissingDaysInDataPointArray(
        groupDataSumByDays(
          convertTransactionsArrayToDataPointArray(
            mergedTransactions,
            walletData.address
          )
        ),
        90
      )
    );

    const charts = {
      [WalletChartsTypes.NETFLOW]: (
        <WalletTransactionsInOutChart
          chartData={chartNetTransactionsPerDayData}
        />
      ),
      [WalletChartsTypes.BALANCE]: (
        <WalletBalanceChart chartData={getBalanceChartData} />
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
