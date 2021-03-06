import { screen } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';
import { renderWithApolloMocks } from '../../utils/tests';
import TotalHodlers from './TotalHodlers';

it('should render total holders with loading pre-screen', async () => {
  const { asFragment } = renderWithApolloMocks(<TotalHodlers />, {
    mocks: {
      HoldersCounter: () => ({ id: 'HOLDERS_COUNTER', count: '997' }),
    },
  });
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot();
  await screen.findByText('997');
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot();
});
