import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';
import * as ResizeObserverModule from 'resize-observer-polyfill';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from '@mui/material';
import {
  expectRowsCountToEqual,
  expectColumnsCountToEqual,
  theme,
} from '../../utils/tests';
import Wallet, { GET_WALLET_WITH_TRANSACTIONS } from './Wallet';

jest.mock('next/router', () => require('next-router-mock'));
window.ResizeObserver = ResizeObserverModule.default;

jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');

  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ height, children }: any) => (
      <div
        className="recharts-responsive-container"
        style={{ width: 800, height: 200 }}
      >
        {children}
      </div>
    ),
  };
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2022, 7, 18, 0, 0, 0));
});

afterAll(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const mockResponse = {
  id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  value: '1235332924150902',
  transactionsFrom: [],
  transactionsTo: [
    {
      id: '0xdbd78eafa88df28c650ed81c4fe6625ab8b6688ca4e3ed7b8732464dc5bc3a13-458',
      txn: '0xdbd78eafa88df28c650ed81c4fe6625ab8b6688ca4e3ed7b8732464dc5bc3a13',
      timestamp: '1660832475',
      from: {
        id: '0x320a50f32fb9e20fe113573031132c89835e496c',
        address: '0x320a50f32fb9e20fe113573031132c89835e496c',
        __typename: 'Wallet',
      },
      to: {
        id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        __typename: 'Wallet',
      },
      value: '20000000000000',
      __typename: 'Transaction',
    },
    {
      id: '0x3e78a86d9f48b0d55fe41820a9dd4a6cfb9311b736362b2d0c1c555a32df3c73-773',
      txn: '0x3e78a86d9f48b0d55fe41820a9dd4a6cfb9311b736362b2d0c1c555a32df3c73',
      timestamp: '1660228240',
      from: {
        id: '0x320a50f32fb9e20fe113573031132c89835e496c',
        address: '0x320a50f32fb9e20fe113573031132c89835e496c',
        __typename: 'Wallet',
      },
      to: {
        id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        __typename: 'Wallet',
      },
      value: '20000000000000',
      __typename: 'Transaction',
    },
    {
      id: '0xd46b23649d2aa46a8f72f4a1fd60975ae6a6520682b9e7139b285d9304d7d012-482',
      txn: '0xd46b23649d2aa46a8f72f4a1fd60975ae6a6520682b9e7139b285d9304d7d012',
      timestamp: '1659288754',
      from: {
        id: '0x320a50f32fb9e20fe113573031132c89835e496c',
        address: '0x320a50f32fb9e20fe113573031132c89835e496c',
        __typename: 'Wallet',
      },
      to: {
        id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        __typename: 'Wallet',
      },
      value: '10000000000000',
      __typename: 'Transaction',
    },
    {
      id: '0xbbd4d4fe950ca91277c8a737cb4362c9234291063663a51a03515f9b5db50c9a-289',
      txn: '0xbbd4d4fe950ca91277c8a737cb4362c9234291063663a51a03515f9b5db50c9a',
      timestamp: '1658972397',
      from: {
        id: '0x320a50f32fb9e20fe113573031132c89835e496c',
        address: '0x320a50f32fb9e20fe113573031132c89835e496c',
        __typename: 'Wallet',
      },
      to: {
        id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        __typename: 'Wallet',
      },
      value: '21500000000000',
      __typename: 'Transaction',
    },
  ],
  __typename: 'Wallet',
};

test('render Wallets table with data', async () => {
  const mocks = [
    {
      request: {
        query: GET_WALLET_WITH_TRANSACTIONS,
        variables: {
          address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        },
      },
      result: {
        data: {
          wallet: mockResponse,
        },
      },
    },
  ];

  const user = userEvent.setup();

  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <MockedProvider mocks={mocks}>
        <Wallet address="0x0d0707963952f2fba59dd06f2b425ace40b492fe" />
      </MockedProvider>
    </ThemeProvider>
  );
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findAllByText('0x0d0707963952f2fba59dd06f2b425ace40b492fe');
  await screen.findByText('Gate.io wallet');
  await screen.findByText('12,353,329.24150902');
  await screen.findByText('+1.00%');
  await screen.findByText('+3.00%');
  expect((await screen.findAllByText('+6.00%')).length).toEqual(2);
  expectColumnsCountToEqual(5);
  expectRowsCountToEqual(4);
  const loadedRender = asFragment();
  await waitFor(() =>
    expect(document.querySelectorAll('.recharts-bar-rectangle')[0]).toBeTruthy()
  );
  expect(snapshotDiff(firstRender, loadedRender)).toMatchSnapshot('loaded');

  const balanceChartBtn = await screen.findByText('Balance (90d)');
  user.click(balanceChartBtn);

  await waitFor(() =>
    expect(document.querySelectorAll('.recharts-area-area')[0]).toBeTruthy()
  );
  expect(snapshotDiff(loadedRender, asFragment())).toMatchSnapshot(
    'switched to netflow chart'
  );
});
