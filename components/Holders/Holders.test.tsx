import { screen, waitFor } from '@testing-library/react';
import * as ResizeObserverModule from 'resize-observer-polyfill';
import snapshotDiff from 'snapshot-diff';

import Holders from './Holders';
import { renderWithApolloMocks } from '../../utils/tests';
import { testData } from './test.fixture';

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
  const { asFragment } = renderWithApolloMocks(<Holders />, {
    mocks: {
      Query: {
        dailyHoldersStates: () => testData,
      },
    },
  });
  const firstRender = asFragment();
  const loaders = await screen.findAllByText('Loading...');
  expect(loaders.length).toBe(2);
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findByText('6,341');
  await screen.findByText('0.00%');
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
});
