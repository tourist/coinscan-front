import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';
import mockRouter from 'next-router-mock';

import Navigation from './Navigation';

jest.mock('next/dist/client/router', () => require('next-router-mock'));
// To support next/link with next@>=12.2.0 https://github.com/scottrippey/next-router-mock/issues/58
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = jest.requireActual('react');
  const router = jest.requireActual('next-router-mock').default;
  const RouterContext = createContext(router);
  return { RouterContext };
});

test('Navigation renders', async () => {
  const user = userEvent.setup();
  const { asFragment, container } = render(<Navigation />);
  const firstRender = asFragment();
  expect(container).toMatchSnapshot('navigation rendered');

  await user.click(await screen.findByText('Transactions'));
  const linkClickedRender = asFragment();
  expect(snapshotDiff(firstRender, linkClickedRender)).toMatchSnapshot(
    'navigated to transactions page'
  );
});

test('Navigation wallet active when wallet in link', () => {
  const user = userEvent.setup();
  mockRouter.setCurrentUrl(
    '/wallet/0x0d0707963952f2fba59dd06f2b425ace40b492fe'
  );
  const { container } = render(<Navigation />);
  expect(container).toMatchSnapshot('navigation rendered');
});
