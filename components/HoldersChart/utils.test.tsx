import { groupDataMaxByWeeks, groupDataMaxByMonths } from './utils';
import { testData } from './test.fixture';

describe('Grouping chart data by timeframe', () => {
  test('works for weeks', () => {
    expect(groupDataMaxByWeeks(testData)).toEqual([
      {
        id: '1658102400',
        count: 6347,
      },
      {
        id: '1657497600',
        count: 6347,
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

  test('works for months', () => {
    expect(groupDataMaxByMonths(testData)).toEqual([
      {
        id: '1656633600',
        count: 6347,
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
