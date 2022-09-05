import { render, screen } from '@testing-library/react';

import SparkBar from './SparkBar';

test('renders with single value', async () => {
  const { container } = render(
    <SparkBar
      id="color-scale-test"
      data={[
        { id: '1660262400', count: 0 },
        { id: '1660348800', count: 0 },
        { id: '1660435200', count: 0 },
        { id: '1660521600', count: 0 },
        { id: '1660608000', count: 0 },
        { id: '1660694400', count: 0 },
        { id: '1660780800', count: 0 },
        { id: '1660867200', count: 2000000000000 },
        { id: '1660953600', count: 0 },
        { id: '1661040000', count: 0 },
        { id: '1661126400', count: 3000000000000 },
        { id: '1661212800', count: 0 },
        { id: '1661299200', count: 0 },
        { id: '1661385600', count: -9000000000000 },
      ]}
    />
  );
  expect(document.querySelectorAll('rect').length).toEqual(3);
  expect(container).toMatchSnapshot();
});

test('not render when empty data array is passed', async () => {
  const { container } = render(<SparkBar id="color-scale-test" data={[]} />);
  expect(container).toBeEmptyDOMElement();
});
