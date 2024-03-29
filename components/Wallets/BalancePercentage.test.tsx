import { render, screen } from '@testing-library/react';

import BalancePercentage, { getBalancePercentage } from './BalancePercentage';

test('balance percentage calculation', async () => {
  // default precision
  expect(getBalancePercentage(56123456000000000)).toEqual(56.1234);

  // passed precision
  expect(getBalancePercentage(56123456000000000, 2)).toEqual(56.12);
});

test('loads and displays no fractional percent', async () => {
  const { container } = render(
    <BalancePercentage balance={'30000000000000000'} />
  );
  expect(screen.getByText('30%'));
  expect(container).toMatchSnapshot();
});

test('loads and displays fractional percent', async () => {
  const { container } = render(
    <BalancePercentage balance={'1111100000000000'} />
  );
  expect(screen.getByText('1.1111%'));
  expect(container).toMatchSnapshot();
});

test('loads and displays very small percent as 0%', async () => {
  const { container } = render(<BalancePercentage balance={'1000000000'} />);
  expect(screen.getByText('0%'));
  expect(container).toMatchSnapshot();
});
