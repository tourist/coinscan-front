import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ResizeObserverModule from 'resize-observer-polyfill';
import snapshotDiff from 'snapshot-diff';

import Holders from './Holders';
import { renderWithApolloSchemaMocks } from '../../utils/tests';
import { testDataDailyHolders } from './test.fixture';

window.ResizeObserver = ResizeObserverModule.default;
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');

  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ height, children }: any) => (
      <div
        className="recharts-responsive-container"
        style={{ width: 800, height: 200 }}
      >
        {children}
      </div>
    ),
  };
});

test('render total holders and interact with groupings', async () => {
  const user = userEvent.setup();
  const { asFragment } = renderWithApolloSchemaMocks(<Holders />, {
    mocks: {
      Query: {
        dailyHoldersStates: () => testDataDailyHolders,
      },
    },
  });
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findByText('6,341');
  await screen.findByText('0%');
  await screen.findByText('-0.14%');
  await screen.findByText('+0.89%');
  await screen.findByText('6/23/2022'); // chart available

  // wait for chart line to animate
  await waitFor(
    () =>
      expect(document.querySelectorAll('.recharts-layer path')[0]).toBeTruthy(),
    {
      timeout: 2000,
    }
  );
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot(
    'chart rendered'
  );

  // test bar count for weekly
  const byWeekBtn = await screen.findByText('By Week');
  await userEvent.click(byWeekBtn);

  await waitFor(() =>
    expect(document.querySelectorAll('.recharts-bar-rectangle').length).toEqual(
      39
    )
  );

  // test bar count for monthly
  const byMonthButton = await screen.findByText('By Month');
  await userEvent.click(byMonthButton);

  await waitFor(
    () =>
      expect(
        document.querySelectorAll('.recharts-bar-rectangle').length
      ).toEqual(10),
    {
      timeout: 4000,
    }
  );
});
