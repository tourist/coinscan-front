import {
  groupDataMaxByWeeks,
  groupDataMaxByMonths,
  toLocaleDateStringUTC,
  toLocaleStringUTC,
  formatUTC,
  endOfWeek,
  groupDataSumByDays,
  convertTransactionsArrayToDataPointArray,
  fillMissingDaysInDataPointArray,
  formatMin,
  formatMax,
} from './charts';
import {
  testDataDailyHolders,
  testDataPointTransactions,
  testDataTransactions,
} from '../components/Holders/test.fixture';

describe('Grouping chart data by timeframe', () => {
  test('works for days - sum aggregator', () => {
    expect(groupDataSumByDays(testDataPointTransactions)).toEqual([
      {
        count: -9000000000000,
        id: '1661385600',
      },
      {
        count: 3000000000000,
        id: '1661126400',
      },
      {
        count: 2000000000000,
        id: '1660867200',
      },
    ]);
  });

  test('works for weeks - max aggregator', () => {
    expect(groupDataMaxByWeeks(testDataDailyHolders)).toEqual([
      {
        id: '1658102400',
        count: 6347,
      },
      {
        id: '1657497600',
        count: 6350,
      },
      {
        id: '1656892800',
        count: 6328,
      },
      {
        id: '1656288000',
        count: 6310,
      },
      {
        id: '1655683200',
        count: 6298,
      },
      {
        id: '1655078400',
        count: 6286,
      },
      {
        id: '1654473600',
        count: 6300,
      },
      {
        id: '1653868800',
        count: 6293,
      },
      {
        id: '1653264000',
        count: 6290,
      },
      {
        id: '1652659200',
        count: 6263,
      },
      {
        id: '1652054400',
        count: 6277,
      },
      {
        id: '1651449600',
        count: 6304,
      },
      {
        id: '1650844800',
        count: 6295,
      },
      {
        id: '1650240000',
        count: 6295,
      },
      {
        id: '1649635200',
        count: 6305,
      },
      {
        id: '1649030400',
        count: 6302,
      },
      {
        id: '1648425600',
        count: 6263,
      },
      {
        id: '1647820800',
        count: 6159,
      },
      {
        id: '1647216000',
        count: 6105,
      },
      {
        id: '1646611200',
        count: 6029,
      },
      {
        id: '1646006400',
        count: 6049,
      },
      {
        id: '1645401600',
        count: 6046,
      },
      {
        id: '1644796800',
        count: 6037,
      },
      {
        id: '1644192000',
        count: 5815,
      },
      {
        id: '1643587200',
        count: 5751,
      },
      {
        id: '1642982400',
        count: 5644,
      },
      {
        id: '1642377600',
        count: 5673,
      },
      {
        id: '1641772800',
        count: 5702,
      },
      {
        id: '1641168000',
        count: 5756,
      },
      {
        id: '1640563200',
        count: 5737,
      },
      {
        id: '1639958400',
        count: 5597,
      },
      {
        id: '1639353600',
        count: 5380,
      },
      {
        id: '1638748800',
        count: 5378,
      },
      {
        id: '1638144000',
        count: 5393,
      },
      {
        id: '1637539200',
        count: 5266,
      },
      {
        id: '1636934400',
        count: 3913,
      },
      {
        id: '1636329600',
        count: 3519,
      },
      {
        id: '1635724800',
        count: 3007,
      },
      {
        id: '1635120000',
        count: 2289,
      },
    ]);
  });

  test('works for months - max aggregator', () => {
    expect(groupDataMaxByMonths(testDataDailyHolders)).toEqual([
      {
        id: '1656633600',
        count: 6350,
      },
      {
        id: '1654041600',
        count: 6302,
      },
      {
        id: '1651363200',
        count: 6304,
      },
      {
        id: '1648771200',
        count: 6305,
      },
      {
        id: '1646092800',
        count: 6221,
      },
      {
        id: '1643673600',
        count: 6049,
      },
      {
        id: '1640995200',
        count: 5756,
      },
      {
        id: '1638316800',
        count: 5729,
      },
      {
        id: '1635724800',
        count: 5273,
      },
      {
        id: '1633046400',
        count: 2289,
      },
    ]);
  });
});

test('transactions convert to DataPoint array', () => {
  expect(
    convertTransactionsArrayToDataPointArray(
      testDataTransactions,
      '0xa43a1fa8435483c49c79b37d729c47821eac6cda'
    )
  ).toEqual([
    { id: '1661414022', count: BigInt(-9000000000000) },
    { id: '1661154822', count: BigInt(3000000000000) },
    { id: '1660895622', count: BigInt(1000000000000) },
    { id: '1660895622', count: BigInt(1000000000000) },
    { id: '1660895622', count: BigInt(1000000000000) },
    { id: '1660895622', count: BigInt(-1000000000000) },
  ]);
});

test('fill missing days in DataPoint array', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2022, 7, 25, 12, 0, 0));

  expect(
    fillMissingDaysInDataPointArray(
      [
        {
          count: BigInt(-9000000000000),
          id: '1661385600',
        },
        {
          count: BigInt(3000000000000),
          id: '1661126400',
        },
        {
          count: BigInt(2000000000000),
          id: '1660867200',
        },
      ],
      14
    )
  ).toEqual([
    { id: '1660262400', count: BigInt(0) },
    { id: '1660348800', count: BigInt(0) },
    { id: '1660435200', count: BigInt(0) },
    { id: '1660521600', count: BigInt(0) },
    { id: '1660608000', count: BigInt(0) },
    { id: '1660694400', count: BigInt(0) },
    { id: '1660780800', count: BigInt(0) },
    { id: '1660867200', count: BigInt(2000000000000) },
    { id: '1660953600', count: BigInt(0) },
    { id: '1661040000', count: BigInt(0) },
    { id: '1661126400', count: BigInt(3000000000000) },
    { id: '1661212800', count: BigInt(0) },
    { id: '1661299200', count: BigInt(0) },
    { id: '1661385600', count: BigInt(-9000000000000) },
  ]);

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('toLocaleDateStringUTC', () => {
  expect(toLocaleDateStringUTC(new Date(2020, 11, 31, 19, 0, 0))).toEqual(
    '1/1/2021'
  );
});

test('toLocaleStringUTC', () => {
  expect(toLocaleStringUTC(new Date(2020, 11, 31, 19, 0, 0))).toEqual(
    '1/1/2021, 12:00:00 AM'
  );
});

test('formatUTC', () => {
  expect(formatUTC(new Date(2020, 11, 31, 19, 0, 0), 'MM.YYYY')).toEqual(
    '01.2021'
  );
});

test('endOfWeek', () => {
  expect(endOfWeek(new Date(2020, 11, 31, 19, 0, 0)).toString()).toEqual(
    'Sun Jan 03 2021 18:59:59 GMT-0500 (Eastern Standard Time)'
  );
});

test('formatMin number', () => {
  expect(formatMin(12345678912345678)).toEqual(12345678912345640);
});

test('formatMin bigint', () => {
  expect(formatMin(BigInt(12345678912345678))).toEqual(123456760);
});

test('formatMax number', () => {
  expect(formatMax(12345678912345678)).toEqual(12345678912345680);
});

test('formatMax bigint', () => {
  expect(formatMax(BigInt(12345678912345678))).toEqual(123456800);
});
