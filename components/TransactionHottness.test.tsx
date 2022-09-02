import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import TransactionHottness from './TransactionHottness';
import { theme } from '../utils/tests';

const TestTransactionHottnes = ({ value }: { value: number }) => (
  <ThemeProvider theme={theme}>
    <TransactionHottness value={value} />
  </ThemeProvider>
);

test('render TransactionHottness middle of scale', async () => {
  const { container } = render(
    <TestTransactionHottnes value={5000000000000} />
  );
  expect(container).toMatchSnapshot(
    'render TransactionHottness middle of scale'
  );
});

test('render TransactionHottness min of scale', async () => {
  const { container } = render(<TestTransactionHottnes value={1} />);
  expect(container).toMatchSnapshot('render TransactionHottness min of scale');
});

test('render TransactionHottnes over max of scale', async () => {
  const { container } = render(
    <TransactionHottness value={1000000000000000} />
  );
  expect(container).toMatchSnapshot(
    'render TransactionHottness over max of scale'
  );
});
