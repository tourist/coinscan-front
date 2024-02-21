import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyToCliboard from './CopyToClipboard';
import { asFragmentBaseElement } from '../utils/tests';

test('render and properly copy to clipboard', async () => {
  const user = userEvent.setup();
  const { baseElement } = render(
    <CopyToCliboard text="example text to copy" />
  );
  let icon = screen.getByLabelText('copy to clipboard');
  await user.hover(icon);
  await screen.findByRole('tooltip');
  const firstRender = asFragmentBaseElement(baseElement);
  expect(firstRender).toMatchSnapshot('render while mouse over icon');

  await user.click(icon);
  await screen.findByLabelText('copied');
  await screen.findByText('copied');
  const clipboardText = await navigator.clipboard.readText();
  expect(clipboardText).toBe('example text to copy');

  // wait for tooltip exact time to reset tooltip after copying
  // trying to use jest.useFakeTimers timeout test
  // similiar issue to https://github.com/facebook/jest/issues/11607
  await screen.findByLabelText('copy to clipboard', undefined, {
    timeout: 1985,
  });
  icon = screen.getByLabelText('copy to clipboard');
  await userEvent.unhover(icon);
  await waitForElementToBeRemoved(screen.queryByRole('tooltip'));
  await screen.findByLabelText('copy to clipboard');
});
