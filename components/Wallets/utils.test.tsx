import dayjs from 'dayjs';
import { getUnixTime } from '../../utils/charts';
import { getNetFlowPercentageFromWallet } from './utils';

const walletMockData = {
  id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  value: '100000000000',
  dailyStates: [
    {
      start: '1660773600',
      inflow: '',
      outflow: '50000000000',
    },
    {
      start: '1660255200',
      inflow: '50000000000',
      outflow: '0',
    },
    {
      start: '1658959200',
      inflow: '',
      outflow: '50000000000',
    },
    {
      start: '1654034400',
      inflow: '',
      outflow: '100000000000',
    },
  ],
};

test('net flow percentage is calculated correctly', () => {
  const oneDayAgo = getUnixTime(
    dayjs(1660773600).utc().subtract(1, 'days').startOf('day').toDate()
  );
  const sevenyDaysAgo = getUnixTime(
    dayjs(1660255200).utc().subtract(7, 'days').startOf('day').toDate()
  );
  const thirtyDaysAgo = getUnixTime(
    dayjs(1658959200).utc().subtract(30, 'days').startOf('day').toDate()
  );
  const ninetyDaysAgo = getUnixTime(
    dayjs(1654034400).utc().subtract(90, 'days').startOf('day').toDate()
  );

  // 1 day
  expect(getNetFlowPercentageFromWallet(walletMockData, 1660773600)).toEqual(
    -33.33
  );

  // 7 days
  expect(getNetFlowPercentageFromWallet(walletMockData, 1660255200)).toEqual(0);

  // 30 days
  expect(getNetFlowPercentageFromWallet(walletMockData, 1658959200)).toEqual(
    -33.33
  );

  // 90 days
  expect(getNetFlowPercentageFromWallet(walletMockData, 1654034400)).toEqual(
    -60
  );
});
