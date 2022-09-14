import { formatValue } from './formatters';

test('formats BigNumberish value correctly', () => {
  expect(formatValue('100000000087654321')).toBe('1,000,000,000.87654321');

  expect(
    formatValue('123459012300000123', {
      notation: 'compact',
      maximumFractionDigits: 3,
    })
  ).toBe('1.235B');

  // drops zero at the end
  expect(formatValue('100000012300000000', { notation: 'compact' })).toBe('1B');
});
