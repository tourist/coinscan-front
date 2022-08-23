import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';

import {
  DailyHodlersStatesDocument,
  GetTransactionsPaginatedQuery,
} from '../../generated/graphql';

dayjs.extend(isoWeek);
dayjs.extend(utc);

type timeFrameFn = (date: Date) => Date;

export type TransactionsQueryData =
  GetTransactionsPaginatedQuery['transactions'];

export type DataPoint = {
  id: string;
  count: number;
};

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

const groupDataByTimeframe = (
  data: DataPoint[],
  currentTimeframeFn: timeFrameFn,
  nextTimeframeFn: timeFrameFn,
  aggregator: typeof maxAggregator
): DataPoint[] => {
  if (!Array.isArray(data) || data.length === 0) {
    return data;
  }
  let groupedData = [...data].reverse();

  const firstDate = parseInt(groupedData[0].id, 10);

  let currentTimeframeDate = currentTimeframeFn(fromUnixTime(firstDate));
  let nextTimeframeDate = nextTimeframeFn(fromUnixTime(firstDate));

  groupedData = groupedData.reduce((acc: DataPoint[], dataItem) => {
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
      acc[lastAccItemIndex].count = aggregator(acc, lastAccItemIndex, dataItem);
    }
    return acc;
  }, []);
  return groupedData.reverse();
};

const maxAggregator = (
  acc: DataPoint[],
  lastAccItemIndex: number,
  dataItem: DataPoint
) => Math.max(dataItem.count, acc[lastAccItemIndex].count);

const sumAggregator = (
  acc: DataPoint[],
  lastAccItemIndex: number,
  dataItem: DataPoint
) => dataItem.count + acc[lastAccItemIndex].count;

export const groupDataSumByDays = (data: DataPoint[]) =>
  groupDataByTimeframe(data, startOfDay, startOfNextDay, sumAggregator);

export const groupDataMaxByWeeks = (data: DataPoint[]) =>
  groupDataByTimeframe(data, previousMonday, nextMonday, maxAggregator);

export const groupDataMaxByMonths = (data: DataPoint[]) =>
  groupDataByTimeframe(data, startOfMonth, startOfNextMonth, maxAggregator);

export const convertTransactionsArrayToDataPointArray = (
  transactions: TransactionsQueryData,
  relativeTowallet: string
): DataPoint[] => {
  return transactions.map((transaction) => ({
    id: transaction.timestamp,
    count:
      transaction.from.address === relativeTowallet
        ? -transaction.value
        : +transaction.value,
  }));
};

export const fillMissingDaysInDataPointArray = (
  data: DataPoint[],
  days: number
) => {
  const filledData: DataPoint[] = [];
  const today = dayjs.utc();
  for (
    let d = today.startOf('day').subtract(days - 1, 'day');
    d <= today.endOf('day');
    d = d.add(1, 'day')
  ) {
    filledData.push({
      id: getUnixTime(d.startOf('day').toDate()).toString(),
      count: 0,
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
