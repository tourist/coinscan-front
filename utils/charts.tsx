import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

import { GetTransactionsPaginatedQuery } from '../generated/graphql';
import settings from '../settings.json';

dayjs.extend(isoWeek);
dayjs.extend(utc);

type timeFrameFn = (date: Date) => Date;

export type TransactionsQueryData =
  GetTransactionsPaginatedQuery['transactions'];

export type DataPoint<T> = {
  id: string;
  count: T;
};

type Numberish = number | bigint;

export const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getUnixTime = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const fromUnixTime = (unixTime: number): Date =>
  new Date(unixTime * 1000);

export const toLocaleDateStringUTC = (date: Date): string =>
  dayjs(date).utc().toDate().toLocaleDateString(undefined, { timeZone: 'UTC' });

export const toLocaleStringUTC = (date: Date): string =>
  dayjs(date).utc().toDate().toLocaleString(undefined, { timeZone: 'UTC' });

export const formatUTC = (date: Date, format: string): string =>
  dayjs(date).utc().format(format);

export const startOfDay = (date: Date): Date =>
  dayjs(date).utc().startOf('day').toDate();

export const startOfNextDay = (date: Date): Date =>
  dayjs(date).utc().add(1, 'day').startOf('day').toDate();

export const endOfWeek = (date: Date): Date =>
  dayjs(date).utc().endOf('isoWeek').toDate();

export const previousMonday = (date: Date): Date =>
  dayjs(date).utc().startOf('isoWeek').toDate();

export const nextMonday = (date: Date): Date => {
  return dayjs(date).utc().add(7, 'day').startOf('isoWeek').toDate();
};

export const startOfMonth = (date: Date): Date => {
  return dayjs(date).utc().startOf('month').toDate();
};

export const startOfNextMonth = (date: Date): Date => {
  return dayjs(date).utc().add(1, 'month').startOf('month').toDate();
};

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
): DataPoint<string>[] => {
  let currentBalance = BigInt(balance);
  transactions.reverse();
  let balanceHistory: DataPoint<string>[] = [];

  transactions.forEach((transaction) => {
    currentBalance = BigInt(currentBalance) - BigInt(transaction.count);
    balanceHistory = [
      {
        id: transaction.id,
        count: currentBalance.toString(),
      },
      ...balanceHistory,
    ];
  });
  return balanceHistory;
};

export const convertValuesToNumber = (data: DataPoint<bigint | string>[]) => {
  return data.map((dataP) => ({
    ...dataP,
    count: Number(dataP.count),
  }));
};

const convertBigIntToNumberWithoutDecimalPlacesPrecision = (
  value: bigint
): number => {
  const dataMaxString = value.toString();
  return Number(
    dataMaxString.substring(0, dataMaxString.length - settings.decimalPlaces)
  );
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
