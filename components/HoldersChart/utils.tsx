import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DailyHodlersStatesQuery } from '../../generated/graphql';

dayjs.extend(isoWeek);
dayjs.extend(utc);

type timeFrameFn = (date: Date) => Date;

type DataPoint = {
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

export type ChartData = DailyHodlersStatesQuery['dailyHoldersStates'];

const groupDataByMaxInTimeframe = (
  data: ChartData,
  currentTimeframeFn: timeFrameFn,
  nextTimeframeFn: timeFrameFn
): ChartData => {
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
    }

    if (parseInt(dataItem.id, 10) > getUnixTime(nextTimeframeDate)) {
      currentTimeframeDate = nextTimeframeDate;
      nextTimeframeDate = nextTimeframeFn(currentTimeframeDate);
      acc.push({
        id: getUnixTime(currentTimeframeDate).toString(),
        count: dataItem.count,
      });
    } else {
      const lastAccItemIndex = acc.length - 1;
      // update value to current if larger
      acc[lastAccItemIndex].count = Math.max(
        dataItem.count,
        acc[lastAccItemIndex].count
      );
    }
    return acc;
  }, []);
  return groupedData.reverse();
};

export const groupDataMaxByWeeks = (data: ChartData) =>
  groupDataByMaxInTimeframe(data, previousMonday, nextMonday);

export const groupDataMaxByMonths = (data: ChartData) =>
  groupDataByMaxInTimeframe(data, startOfMonth, startOfNextMonth);
