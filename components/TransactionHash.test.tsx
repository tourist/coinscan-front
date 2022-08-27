import { screen, render } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';
import TransactionHash from './TransactionHash';

test('render transactions hash', async () => {
  const { container } = render(
    <TransactionHash txn="0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d" />
  );
  screen.getByText(
    '0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d'
  );
  expect(
    screen.getAllByTitle(
      'https://polygonscan.com/tx/0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d'
    )[0]
  ).toHaveAttribute(
    'href',
    'https://polygonscan.com/tx/0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d'
  );
  expect(container).toMatchSnapshot();
});

test('render transactions hash with short prop', async () => {
  const { container } = render(
    <TransactionHash txn="0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d" />
  );
  screen.getByText(
    '0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d'
  );
  expect(container).toMatchSnapshot();
});

test('render wallet with short prop set', async () => {
  const { asFragment, rerender } = render(
    <TransactionHash txn="0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d" />
  );
  const firstRender = asFragment();
  rerender(
    <TransactionHash
      txn="0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d"
      short
    />
  );
  screen.getByText(
    '0x6399e5841ee8b11186186c1a3aed92d93041e22bef09f599460735492b57851d'
  );
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot(
    'rerender with short prop'
  );
});
