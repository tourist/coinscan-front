import { groupDataMaxByWeeks, groupDataMaxByMonths } from './utils';
import { testData } from './test.fixture';

describe('Grouping chart data by timeframe', () => {
  it('works for weeks', () => {
    expect(groupDataMaxByWeeks(testData)).toEqual([
      {
        id: '1657497600',
        count: 6336,
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
        id: '1647824400',
        count: 6159,
      },
      {
        id: '1647219600',
        count: 6105,
      },
      {
        id: '1646614800',
        count: 6029,
      },
      {
        id: '1646010000',
        count: 6049,
      },
      {
        id: '1645405200',
        count: 6046,
      },
      {
        id: '1644800400',
        count: 6037,
      },
      {
        id: '1644195600',
        count: 5815,
      },
      {
        id: '1643590800',
        count: 5751,
      },
      {
        id: '1642986000',
        count: 5644,
      },
      {
        id: '1642381200',
        count: 5673,
      },
      {
        id: '1641776400',
        count: 5702,
      },
      {
        id: '1641171600',
        count: 5756,
      },
      {
        id: '1640566800',
        count: 5737,
      },
      {
        id: '1639962000',
        count: 5597,
      },
      {
        id: '1639357200',
        count: 5380,
      },
      {
        id: '1638752400',
        count: 5378,
      },
      {
        id: '1638147600',
        count: 5393,
      },
      {
        id: '1637542800',
        count: 5266,
      },
      {
        id: '1636938000',
        count: 3913,
      },
      {
        id: '1636333200',
        count: 3519,
      },
      {
        id: '1635728400',
        count: 3007,
      },
      {
        id: '1635120000',
        count: 2289,
      },
    ]);
  });

  it('works for months', () => {
    expect(groupDataMaxByMonths(testData)).toEqual([
      {
        id: '1656626400',
        count: 6336,
      },
      {
        id: '1654034400',
        count: 6302,
      },
      {
        id: '1651356000',
        count: 6304,
      },
      {
        id: '1648764000',
        count: 6305,
      },
      {
        id: '1646089200',
        count: 6208,
      },
      {
        id: '1643670000',
        count: 6046,
      },
      {
        id: '1640991600',
        count: 5756,
      },
      {
        id: '1638313200',
        count: 5696,
      },
      {
        id: '1635721200',
        count: 5266,
      },
      {
        id: '1633039200',
        count: 2250,
      },
    ]);
  });
});
