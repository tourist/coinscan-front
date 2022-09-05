import { screen, render } from '@testing-library/react';
import Hash from './Hash';

test('render hash', async () => {
  const { container } = render(
    <Hash text="0x320a50f32fb9e20fe113573031132c89835e496c" />
  );
  screen.getByText('0x320a50f32fb9e20fe113573031132c89835e496c');
  expect(container).toMatchSnapshot('render while mouse over icon');
});
