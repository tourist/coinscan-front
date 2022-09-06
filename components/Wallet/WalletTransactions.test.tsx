import { ThemeProvider } from '@mui/material';
import { screen } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';

import { theme, renderWithApolloSchemaMocks } from '../../utils/tests';
import WalletTransactions from './WalletTransactions';

jest.mock('next/router', () => require('next-router-mock'));

export const mockResponse = [
  // incoming
  {
    value: '1900000000000',
    timestamp: '1635360445',
    transaction: {
      id: '0x13f0640425a851816d2bf83230e3ebcad5969445dac169b4cb714948a34d5f63-54',
      txn: '0x13f0640425a851816d2bf83230e3ebcad5969445dac169b4cb714948a34d5f63',
      timestamp: '1635360445',
      from: {
        id: '0x2ddc842ce54866d6ff58f5f82c6fb838e6a74cd3',
        address: '0x2ddc842ce54866d6ff58f5f82c6fb838e6a74cd3',
        __typename: 'Wallet',
      },
      to: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      value: '1900000000000',
      __typename: 'Transaction',
    },
    __typename: 'WalletTransaction',
  },
  {
    value: '3000000000000000',
    timestamp: '1635710995',
    transaction: {
      id: '0x195b7ed5e4af8e7f25c533fa9b3917157a662e64d7baf078d91134588a0c8515-242',
      txn: '0x195b7ed5e4af8e7f25c533fa9b3917157a662e64d7baf078d91134588a0c8515',
      timestamp: '1635710995',
      from: {
        id: '0xf2e4efbcec08d128205d299d6358e7d095eab2f4',
        address: '0xf2e4efbcec08d128205d299d6358e7d095eab2f4',
        __typename: 'Wallet',
      },
      to: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      value: '3000000000000000',
      __typename: 'Transaction',
    },
    __typename: 'WalletTransaction',
  },
  {
    value: '20000000000000000',
    timestamp: '1635324456',
    transaction: {
      id: '0x44e0d1633dde47ed571d99fdf3d35f01b2c5b06476e2a42203ce90c3fe959eee-330',
      txn: '0x44e0d1633dde47ed571d99fdf3d35f01b2c5b06476e2a42203ce90c3fe959eee',
      timestamp: '1635324456',
      from: {
        id: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
        address: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
        __typename: 'Wallet',
      },
      to: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      value: '20000000000000000',
      __typename: 'Transaction',
    },
    __typename: 'WalletTransaction',
  },
  {
    value: '8998100000000000',
    timestamp: '1635711123',
    transaction: {
      id: '0xda33ce85b3e25979edf69b2b6af5af48a066fea1732843fc535685eb6b8a01e3-82',
      txn: '0xda33ce85b3e25979edf69b2b6af5af48a066fea1732843fc535685eb6b8a01e3',
      timestamp: '1635711123',
      from: {
        id: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
        address: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
        __typename: 'Wallet',
      },
      to: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      value: '8998100000000000',
      __typename: 'Transaction',
    },
    __typename: 'WalletTransaction',
  },
  // outgoing
  {
    value: '1000000000000000',
    timestamp: '1635579654',
    transaction: {
      id: '0x4422a6177688044c63117a8400810498d36debdbc1da31ce7b4fe1c548f4e0fe-272',
      txn: '0x4422a6177688044c63117a8400810498d36debdbc1da31ce7b4fe1c548f4e0fe',
      timestamp: '1635579654',
      from: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      to: {
        id: '0x586c21a779c24efd2a8af33c9f7df2a2ea9af55c',
        address: '0x586c21a779c24efd2a8af33c9f7df2a2ea9af55c',
        __typename: 'Wallet',
      },
      value: '1000000000000000',
      __typename: 'Transaction',
    },
    __typename: 'WalletTransaction',
  },
  {
    value: '1000000000000000',
    timestamp: '1635386555',
    transaction: {
      id: '0xeb3216f0faac04becff212ecd589dbcc6fa0b893a2ee3d881ec6af2658794b69-665',
      txn: '0xeb3216f0faac04becff212ecd589dbcc6fa0b893a2ee3d881ec6af2658794b69',
      timestamp: '1635386555',
      from: {
        id: '0xc6695c80913a37219929ec26f746283842d02cd0',
        address: '0xc6695c80913a37219929ec26f746283842d02cd0',
        __typename: 'Wallet',
      },
      to: {
        id: '0xf09e39bad455d05602dfa99ad77a7c1699e39a7d',
        address: '0xf09e39bad455d05602dfa99ad77a7c1699e39a7d',
        __typename: 'Wallet',
      },
      value: '1000000000000000',
      __typename: 'Transaction',
    },
  },
];

test('render WalletTransactions with data', async () => {
  const { asFragment } = renderWithApolloSchemaMocks(
    <ThemeProvider theme={theme}>
      <WalletTransactions address="0xc6695c80913a37219929ec26f746283842d02cd0" />
    </ThemeProvider>,
    {
      mocks: {
        Query: {
          walletTransactions: () => mockResponse,
        },
      },
    }
  );
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findAllByText('0xf09e39bad455d05602dfa99ad77a7c1699e39a7d');
  await screen.findAllByText('Deployer');
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot('loaded');
});
