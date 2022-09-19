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
import { GET_WALLET_TRANSACTIONS_PAGINATED } from './WalletTransactions';
import { mockResponse as transactionsMockResponse } from './WalletTransactions.test';
import Wallet, { GET_WALLET_WITH_DAILY_STATES } from './Wallet';

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

const walletDataMockResponse = {
  id: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
  value: '100000000000',
  dailyStates: [
    {
      start: '1660773600',
      inflow: '',
      outflow: '50000000000',
    },
    {
      start: '1660255200',
      inflow: '50000000000',
      outflow: '0',
    },
    {
      start: '1658959200',
      inflow: '',
      outflow: '50000000000',
    },
    {
      start: '1654034400',
      inflow: '',
      outflow: '100000000000',
    },
  ],
  __typename: 'WalletTransactions',
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2022, 7, 18, 0, 0, 0));
});

afterAll(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('render Wallet details, charts and transactions', async () => {
  const mockWalletTransactionResponse = {
    request: {
      query: GET_WALLET_TRANSACTIONS_PAGINATED,
      variables: {
        first: 10,
        skip: 0,
        orderBy: 'timestamp',
        orderDirection: 'desc',
        page: 1,
        where: { wallet: '0x0d0707963952f2fba59dd06f2b425ace40b492fe' },
      },
    },
    result: {
      data: {
        walletTransactions: transactionsMockResponse,
      },
    },
  };

  const mocks = [
    {
      request: {
        query: GET_WALLET_WITH_DAILY_STATES,
        variables: {
          address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
        },
      },
      result: {
        data: {
          wallet: walletDataMockResponse,
        },
      },
    },
    mockWalletTransactionResponse,
    mockWalletTransactionResponse,
  ];

  const user = userEvent.setup();

  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Wallet address="0x0d0707963952f2fba59dd06f2b425ace40b492fe" />
      </MockedProvider>
    </ThemeProvider>
  );
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');

  await screen.findAllByText('0x0d0707963952f2fba59dd06f2b425ace40b492fe');
  await screen.findByText('Gate.io wallet');
  await screen.findByText('1,000');
  expect((await screen.findAllByText('-33.33%')).length).toEqual(2); // 1 day and 30 day change
  await screen.findByText('-60%'); // 90 day change
  await screen.findByText('0%'); // 7 days percentage change

  // wait for transactions to load
  await screen.findAllByText(
    '0x4422a6177688044c63117a8400810498d36debdbc1da31ce7b4fe1c548f4e0fe'
  );
  expectColumnsCountToEqual(7);
  expectRowsCountToEqual(6);
  const loadedRender = asFragment();
  await waitFor(() =>
    expect(document.querySelectorAll('.recharts-bar-rectangle')[0]).toBeTruthy()
  );
  expect(snapshotDiff(firstRender, loadedRender)).toMatchSnapshot('loaded');

  const balanceChartBtn = await screen.findByText('Balance history');
  user.click(balanceChartBtn);

  await waitFor(() =>
    expect(document.querySelectorAll('.recharts-area-area')[0]).toBeTruthy()
  );
  expect(snapshotDiff(loadedRender, asFragment())).toMatchSnapshot(
    'switched to netflow chart'
  );
});
