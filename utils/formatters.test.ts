import { formatValue } from './formatters';

test('formats BigNumberish value correctly', () => {
  expect(formatValue('100000000087654321')).toBe('1,000,000,000.87654321');
});
