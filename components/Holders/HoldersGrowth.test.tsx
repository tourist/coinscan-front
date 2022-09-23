import { render } from '@testing-library/react';
import HoldersGrowth from './HoldersGrowth';

test('loading state', () => {
  const { container } = render(
    <HoldersGrowth
      holdersCount={100}
      oneday={10}
      sevendays={30}
      thirtydays={40}
      loading
    />
  );

  expect(container).toMatchSnapshot('loading state');
});
