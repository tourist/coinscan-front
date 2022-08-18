import { render } from '@testing-library/react';
import Navigation from './Navigation';

jest.mock('next/router', () => require('next-router-mock'));

test('Navigation renders', () => {
  const { container } = render(<Navigation />);
  expect(container).toMatchSnapshot('navigation rendered');
});
