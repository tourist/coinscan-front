import { render, screen } from '@testing-library/react';

import ColorScale from './ColorScale';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders with single value', async () => {
  const { container } = render(<ColorScale id="color-scale-test" data={30} />);
  screen.getByText('+30%');
  expect(container).toMatchSnapshot();
});

test('renders with array', async () => {
  const { container } = render(
    <ColorScale id="color-scale-test" data={[-30, 70]} />
  );
  await screen.findByText('-30%');
  await screen.findByText('+70%');
  expect(container).toMatchSnapshot();
});

test('not render on 0 passed and show warning in console', async () => {
  const mockedWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const { container } = render(<ColorScale id="color-scale-test" data={0} />);
  expect(container).toMatchSnapshot();
  expect(mockedWarn).toBeCalledWith(
    "0 passed as data value, should be handled outside as special case as it's not presentable."
  );
});

test('issue error on array length passed', async () => {
  const mockedError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const { container } = render(
    <ColorScale id="color-scale-test" data={[10, 20, 30]} />
  );
  expect(container).toMatchSnapshot();
  expect(mockedError).toBeCalledWith(
    'Wrong data array length. Expected 2 elements. Passed: 3'
  );
});
