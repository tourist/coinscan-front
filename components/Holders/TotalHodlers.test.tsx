import { screen, render } from '@testing-library/react';
import TotalHodlers from './TotalHodlers';
import { testDataDailyHolders } from './test.fixture';

test('render total holders', async () => {
  const { container } = render(
    <TotalHodlers data={{ dailyHoldersStates: testDataDailyHolders }} />
  );
  await screen.findByText('6,341');
  await screen.findByText('0%');
  await screen.findByText('-0.14%');
  await screen.findByText('+0.89%');
  expect(container).toMatchSnapshot();
});
