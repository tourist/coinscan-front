import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';
import CopyToCliboard from './CopyToClipboard';
import { asFragmentBaseElement } from '../utils/tests';

test('render and properly copy to clipboard', async () => {
  const user = userEvent.setup();
  const { baseElement } = render(
    <CopyToCliboard text="example text to copy" />
  );
  const icon = screen.getByLabelText('copy to clipboard');
  await user.hover(icon);
  await screen.findByRole('tooltip');
  const firstRender = asFragmentBaseElement(baseElement);
  expect(firstRender).toMatchSnapshot('render while mouse over icon');

  await user.click(icon);
  await screen.findByLabelText('copied');
  const afterClickRender = asFragmentBaseElement(baseElement);
  expect(snapshotDiff(firstRender, afterClickRender)).toMatchSnapshot(
    'render when clicked to copy'
  );
  const clipboardText = await navigator.clipboard.readText();
  expect(clipboardText).toBe('example text to copy');

  await userEvent.unhover(icon);
  await waitForElementToBeRemoved(() => screen.getByRole('tooltip'));
  await screen.findByLabelText('copy to clipboard');
  const onTooltipHide = asFragmentBaseElement(baseElement);
  expect(snapshotDiff(afterClickRender, onTooltipHide)).toMatchSnapshot(
    'render after click and unhover'
  );
});
