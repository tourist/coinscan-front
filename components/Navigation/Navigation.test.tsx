import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';
import mockRouter from 'next-router-mock';

import Navigation from './Navigation';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

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
