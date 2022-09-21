import { screen, render } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from '@mui/material';
import { Wallet_OrderBy, OrderDirection } from '../../generated/graphql';
import {
  expectRowsCountToEqual,
  expectColumnsCountToEqual,
  theme,
} from '../../utils/tests';
import { PER_PAGE_DEFAULT } from '../MaterialTable/MaterialTable';
import Wallets, { GET_WALLETS_PAGINATED } from './Wallets';

jest.mock('next/router', () => require('next-router-mock'));

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2022, 7, 18, 0, 0, 0));
});

afterAll(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const mockResponse = [
  {
    address: '0xc6695c80913a37219929ec26f746283842d02cd0',
    value: '30000000000000000',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0xf2e4efbcec08d128205d299d6358e7d095eab2f4',
    value: '15000000000000000',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0xceeae72d35f5e6fb3e479f0e21eb0f1974146cd4',
    value: '13000000000000000',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0x586c21a779c24efd2a8af33c9f7df2a2ea9af55c',
    value: '11005900000000000',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
    value: '7283399143252128',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
    value: '5063241593207542',
    __typename: 'Wallet',
    dailyStates: [],
  },
  {
    address: '0x531bcca5bd3323bb5338b6db1dde7532b7299ac1',
    value: '3449053761557226',
    dailyStates: [],
    __typename: 'Wallet',
  },
  {
    address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
    value: '3500000000000000',
    dailyStates: [
      { start: '1660773600', inflow: '0', outflow: '20000000000000' },
      { start: '1660168800', inflow: '0', outflow: '20000000000000' },
      { start: '1659218400', inflow: '0', outflow: '10000000000000' },
      {
        start: '1658959200',
        inflow: '0',
        outflow: '21500000000000',
      },
    ],
    __typename: 'Wallet',
  },
  {
    address: '0x320a50f32fb9e20fe113573031132c89835e496c',
    value: '1500000000000000',
    dailyStates: [
      { start: '1660773600', inflow: '0', outflow: '20000000000000' },
      { start: '1660168800', inflow: '0', outflow: '20000000000000' },
      { start: '1660168800', inflow: '0', outflow: '20000000000000' },
      { start: '1659218400', inflow: '0', outflow: '10000000000000' },
      { start: '1658959200', inflow: '0', outflow: '21500000000000' },
    ],
    __typename: 'Wallet',
  },
];

test('render Wallets table with data', async () => {
  const mocks = [
    {
      request: {
        query: GET_WALLETS_PAGINATED,
        variables: {
          first: PER_PAGE_DEFAULT,
          skip: 0,
          orderBy: Wallet_OrderBy.Value,
          orderDirection: OrderDirection.Desc,
          page: 1,
          address: '',
        },
      },
      result: {
        data: {
          wallets: mockResponse,
        },
      },
    },
  ];

  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Wallets />
      </MockedProvider>
    </ThemeProvider>
  );
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findAllByTitle('0xc6695c80913a37219929ec26f746283842d02cd0');
  expectColumnsCountToEqual(8);
  expectRowsCountToEqual(9);
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot('loaded');
});
