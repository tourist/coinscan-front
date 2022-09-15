import dayjs from 'dayjs';
import { XAxisProps } from 'recharts';

import {
  DailyWalletState,
  GetTransactionsPaginatedQuery,
} from '../generated/graphql';
import settings from '../settings.json';
import { Props as DefaultTooltipContentProps } from 'recharts/types/component/DefaultTooltipContent';
import {
  fromUnixTime,
  getUnixTime,
  startOfDay,
  startOfNextDay,
  previousMonday,
  nextMonday,
  startOfMonth,
  startOfNextMonth,
  toLocaleDateStringUTC,
  formatUTC,
  endOfWeek,
} from './time';

type timeFrameFn = (date: Date) => Date;

export type TransactionsQueryData =
  GetTransactionsPaginatedQuery['transactions'];

export interface DataPoint<T> {
  id: string;
  count: T;
}

export interface DataPointWithDisplay<T> extends Omit<DataPoint<T>, 'count'> {
  count: number;
  display: bigint;
}

type Numberish = number | bigint;

const groupDataByTimeframe = <T extends Numberish>(
  data: DataPoint<T>[],
  currentTimeframeFn: timeFrameFn,
  nextTimeframeFn: timeFrameFn,
  aggregator: typeof maxAggregator
): DataPoint<T>[] => {
  if (!Array.isArray(data) || data.length === 0) {
    return data;
  }
  let groupedData = [...data].reverse();

  const firstDate = parseInt(groupedData[0].id, 10);

  let currentTimeframeDate = currentTimeframeFn(fromUnixTime(firstDate));
  let nextTimeframeDate = nextTimeframeFn(fromUnixTime(firstDate));

  groupedData = groupedData.reduce(
    (acc: DataPoint<T>[], dataItem: DataPoint<T>) => {
      if (acc.length === 0) {
        acc.push({
          id: getUnixTime(currentTimeframeDate).toString(),
          count: dataItem.count,
        });
        return acc;
      }

      if (parseInt(dataItem.id, 10) > getUnixTime(nextTimeframeDate)) {
        currentTimeframeDate = currentTimeframeFn(
          fromUnixTime(parseInt(dataItem.id, 10))
        );
        nextTimeframeDate = nextTimeframeFn(currentTimeframeDate);
        acc.push({
          id: getUnixTime(currentTimeframeDate).toString(),
          count: dataItem.count,
        });
      } else {
        const lastAccItemIndex = acc.length - 1;
        acc[lastAccItemIndex].count = aggregator(
          acc,
          lastAccItemIndex,
          dataItem
        );
      }
      return acc;
    },
    []
  );
  return groupedData.reverse();
};

const maxAggregator = <T extends Numberish>(
  acc: DataPoint<T>[],
  lastAccItemIndex: number,
  dataItem: DataPoint<T>
): T => {
  if (dataItem.count > acc[lastAccItemIndex].count) {
    return dataItem.count;
  }
  if (dataItem.count < acc[lastAccItemIndex].count) {
    return acc[lastAccItemIndex].count;
  }

  return dataItem.count;
};

type ISumAggregator = {
  (
    acc: DataPoint<bigint>[],
    lastAccItemIndex: number,
    dataItem: DataPoint<bigint>
  ): bigint;
  (
    acc: DataPoint<number>[],
    lastAccItemIndex: number,
    dataItem: DataPoint<number>
  ): number;
};

const sumAggregator: ISumAggregator = (
  acc: any,
  lastAccItemIndex: number,
  dataItem: any
): any => dataItem.count + acc[lastAccItemIndex].count;

export const groupDataSumByDays = <T extends Numberish>(data: DataPoint<T>[]) =>
  groupDataByTimeframe(data, startOfDay, startOfNextDay, sumAggregator);

export const groupDataMaxByWeeks = <T extends Numberish>(
  data: DataPoint<T>[]
) => groupDataByTimeframe(data, previousMonday, nextMonday, maxAggregator);

export const groupDataMaxByMonths = <T extends Numberish>(
  data: DataPoint<T>[]
) => groupDataByTimeframe(data, startOfMonth, startOfNextMonth, maxAggregator);

export const convertTransactionsArrayToDataPointArray = (
  transactions: TransactionsQueryData,
  relativeTowallet: string
): DataPoint<bigint>[] => {
  const dataPointArray: DataPoint<bigint>[] = transactions.map(
    (transaction): DataPoint<bigint> => ({
      id: transaction.timestamp,
      count:
        transaction.from.address === relativeTowallet
          ? BigInt(0) - BigInt(transaction.value)
          : BigInt(transaction.value),
    })
  );
  return dataPointArray;
};

export const convertWalletDailyStatesToDataPointArray = (
  dailyStates: Pick<DailyWalletState, 'start' | 'inflow' | 'outflow'>[]
): DataPoint<bigint>[] => {
  return dailyStates.map((dailyState) => ({
    id: dailyState.start,
    count: BigInt(dailyState.inflow) - BigInt(dailyState.outflow),
  }));
};

export const fillMissingDaysInDataPointArray = (
  data: DataPoint<bigint>[],
  days: number
): DataPoint<bigint>[] => {
  const filledData: DataPoint<bigint>[] = [];
  const today = dayjs.utc();
  for (
    let d = today.startOf('day').subtract(days - 1, 'day');
    d <= today.endOf('day');
    d = d.add(1, 'day')
  ) {
    filledData.push({
      id: getUnixTime(d.startOf('day').toDate()).toString(),
      count: BigInt(0),
    });
  }

  data.forEach((dataPoint) => {
    const filledDataPoint = filledData.find((d) => d.id === dataPoint.id);
    if (filledDataPoint) {
      filledDataPoint.count = dataPoint.count;
    }
  });
  return filledData;
};

export const calculateHistoryBalanceFromTransactions = (
  transactions: DataPoint<bigint>[],
  balance: bigint
): DataPoint<bigint>[] => {
  let currentBalance = BigInt(balance);
  transactions.reverse();
  let balanceHistory: DataPoint<bigint>[] = [];

  transactions.forEach((transaction) => {
    currentBalance = BigInt(currentBalance) - BigInt(transaction.count);
    balanceHistory = [
      {
        id: transaction.id,
        count: currentBalance,
      },
      ...balanceHistory,
    ];
  });
  return balanceHistory;
};

export const convertBigIntToNumberWithoutDecimalPlacesPrecision = (
  value: bigint
): number => {
  const dataMaxString = value.toString();
  return Number(
    dataMaxString.substring(0, dataMaxString.length - settings.decimalPlaces)
  );
};

export const convertToChartableData = (
  data: DataPoint<bigint>[]
): DataPointWithDisplay<bigint>[] => {
  const displayableData = data.map((dataP) => ({
    ...dataP,
    count: convertBigIntToNumberWithoutDecimalPlacesPrecision(dataP.count),
    display: dataP.count,
  }));

  return displayableData;
};

export const formatMin = (
  dataMin: Numberish,
  roundingBase: number = Math.pow(10, settings.decimalPlaces)
): number => {
  if (typeof dataMin === 'bigint') {
    dataMin = convertBigIntToNumberWithoutDecimalPlacesPrecision(dataMin);
  }
  return dataMin - (dataMin % roundingBase);
};

export const formatMax = (
  dataMax: Numberish,
  roundingBase: number = Math.pow(10, settings.decimalPlaces)
): number => {
  if (typeof dataMax === 'bigint') {
    dataMax = convertBigIntToNumberWithoutDecimalPlacesPrecision(dataMax);
  }
  return dataMax + (roundingBase - (dataMax % roundingBase));
};

export enum ChartTimeGroupings {
  BY_DAY,
  BY_WEEK,
  BY_MONTH,
}

export const LINE_CHART_GROUPS = [ChartTimeGroupings.BY_DAY];
export const BAR_CHART_GROUPS = [
  ChartTimeGroupings.BY_WEEK,
  ChartTimeGroupings.BY_MONTH,
];

type XAxisTickFormatterFn = XAxisProps['tickFormatter'];

type XAxisTickFormatters = {
  [key in ChartTimeGroupings]: XAxisTickFormatterFn;
};

export const CHART_TIME_XAXIS_TICK_FORMATTERS: XAxisTickFormatters = {
  [ChartTimeGroupings.BY_DAY]: (value) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(value, 10))),
  [ChartTimeGroupings.BY_WEEK]: (value) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(value, 10))),
  [ChartTimeGroupings.BY_MONTH]: (value) =>
    formatUTC(fromUnixTime(parseInt(value, 10)), 'MM.YYYY'),
};

type TooltipLabelFormatterFn = DefaultTooltipContentProps<
  string,
  number
>['labelFormatter'];

type TooltipLabelFormatters = {
  [key in ChartTimeGroupings]: TooltipLabelFormatterFn;
};

export const CHART_TIME_TOOLTIP_LABEL_FORMATTERS: TooltipLabelFormatters = {
  [ChartTimeGroupings.BY_DAY]: (label: string) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(label, 10))),
  [ChartTimeGroupings.BY_WEEK]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    const start = toLocaleDateStringUTC(dataDatetime);
    const end = toLocaleDateStringUTC(endOfWeek(dataDatetime));
    return `${start} - ${end}`;
  },
  [ChartTimeGroupings.BY_MONTH]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    return `${formatUTC(dataDatetime, 'MM.YYYY')}`;
  },
};
