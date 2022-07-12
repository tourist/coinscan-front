import {
  fromUnixTime,
  previousMonday,
  nextMonday,
  getUnixTime,
  startOfMonth,
  addMonths,
} from 'date-fns';
import { DailyHodlersStatesQuery } from '../../generated/graphql';

const startOfNextMonth = (date: Date) => startOfMonth(addMonths(date, 1));

type DataPoint = {
  id: string;
  count: number;
};

type timeFrameFn =
  | typeof previousMonday
  | typeof nextMonday
  | typeof startOfMonth
  | typeof startOfNextMonth;

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

  const firstDate = fromUnixTime(parseInt(groupedData[0].id, 10));
  let currentTimeframeDate = currentTimeframeFn(firstDate);
  let nextTimeframeDate = nextTimeframeFn(firstDate);

  groupedData = groupedData.reduce((acc: DataPoint[], dataItem) => {
    if (acc.length === 0) {
      acc.push({
        id: getUnixTime(currentTimeframeDate).toString(),
        count: dataItem.count,
      });
    }

    if (fromUnixTime(parseInt(dataItem.id, 10)) > nextTimeframeDate) {
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
