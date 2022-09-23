import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isoWeek);
dayjs.extend(utc);

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
