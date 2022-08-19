import { screen, render } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';
import WalletLink from './WalletLink';

test('render wallet link without link', async () => {
  const { container } = render(
    <WalletLink
      currentWallet="0x320a50f32fb9e20fe113573unknown"
      walletToLink="0x320a50f32fb9e20fe113573unknown"
    />
  );
  screen.getByText('0x320a50f32fb9e20fe113573unknown');
  expect(container).toMatchSnapshot();
});

test('render wallet link with link when currentWallet passed', async () => {
  const { container } = render(
    <WalletLink
      currentWallet="0x320a50f32fb9e20fe113573current"
      walletToLink="0x320a50f32fb9e20fe113573other"
    />
  );
  screen.getByText('0x320a50f32fb9e20fe113573other');
  expect(
    screen
      .getAllByTitle('0x320a50f32fb9e20fe113573other')[0]
      .getAttribute('href')
  ).toEqual('/wallet/0x320a50f32fb9e20fe113573other');
  expect(container).toMatchSnapshot();
});

test('render wallet link without link when currentWallet passed', async () => {
  const { container } = render(
    <WalletLink
      currentWallet="0x320a50f32fb9e20fe113573other"
      walletToLink="0x320a50f32fb9e20fe113573other"
    />
  );
  screen.getByText('0x320a50f32fb9e20fe113573other');
  expect(container).toMatchSnapshot();
});

test('render wallet with external link to scanner', async () => {
  const { container } = render(
    <WalletLink walletToLink="0x320a50f32fb9e20fe113573" scannerLink />
  );
  screen.getByText('0x320a50f32fb9e20fe113573');
  expect(
    screen
      .getAllByTitle(
        'https://polygonscan.com/address/0x320a50f32fb9e20fe113573'
      )[0]
      .getAttribute('href')
  ).toEqual('https://polygonscan.com/address/0x320a50f32fb9e20fe113573');
  expect(container).toMatchSnapshot();
});

test('render wallet with short prop set', async () => {
  const { asFragment, rerender } = render(
    <WalletLink walletToLink="0x320a50f32fb9e20fe113573" />
  );
  const firstRender = asFragment();
  rerender(<WalletLink walletToLink="0x320a50f32fb9e20fe113573" short />);
  screen.getByText('0x320a50f32fb9e20fe113573');
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot(
    'rerender with short prop'
  );
});
