import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';

import {
  convertTransactionsArrayToDataPointArray,
  fillMissingDaysInDataPointArray,
  groupDataSumByDays,
  calculateHistoryBalanceFromTransactions,
  convertValuesToNumber,
} from '../Holders/utils';
import { Transaction } from '../Wallets/WalletTransactions';
import WalletBalanceChart from './WalletBalanceChart';
import WalletTransactionsInOutChart from './WalletTransactionsInOutChart';

type WalletHeadersChartsProps = {
  transactions: Transaction[];
  address: string;
  balance: bigint;
};

export enum WalletCharts {
  NETFLOW,
  BALANCE,
}

const WalletHeaderCharts = ({
  transactions,
  address,
  balance,
}: WalletHeadersChartsProps) => {
  const [visibleChart, setVisibleChart] = useState<WalletCharts>(
    WalletCharts.NETFLOW
  );

  const getBalanceChartData = convertValuesToNumber(
    calculateHistoryBalanceFromTransactions(
      fillMissingDaysInDataPointArray(
        groupDataSumByDays(
          convertTransactionsArrayToDataPointArray(transactions, address)
        ),
        90
      ),
      balance
    )
  );
  const chartNetTransactionsPerDayData = convertValuesToNumber(
    fillMissingDaysInDataPointArray(
      groupDataSumByDays(
        convertTransactionsArrayToDataPointArray(transactions, address)
      ),
      90
    )
  );

  const charts = {
    [WalletCharts.NETFLOW]: (
      <WalletTransactionsInOutChart
        chartData={chartNetTransactionsPerDayData}
      />
    ),
    [WalletCharts.BALANCE]: (
      <WalletBalanceChart chartData={getBalanceChartData} />
    ),
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end' }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            disabled={visibleChart === WalletCharts.NETFLOW}
            onClick={() => setVisibleChart(WalletCharts.NETFLOW)}
          >
            Netflow (90d)
          </Button>
          <Button
            disabled={visibleChart === WalletCharts.BALANCE}
            onClick={() => setVisibleChart(WalletCharts.BALANCE)}
          >
            Balance (90d)
          </Button>
        </ButtonGroup>
      </Box>
      {charts[visibleChart]}
    </Box>
  );
};

export default WalletHeaderCharts;
