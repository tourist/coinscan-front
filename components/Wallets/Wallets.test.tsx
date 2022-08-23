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
import { PER_PAGE_DEFAULT } from '../MaterialRemoteTable';
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
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
    address: '0xf2e4efbcec08d128205d299d6358e7d095eab2f4',
    value: '15000000000000000',
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
    address: '0xceeae72d35f5e6fb3e479f0e21eb0f1974146cd4',
    value: '13000000000000000',
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
    address: '0x586c21a779c24efd2a8af33c9f7df2a2ea9af55c',
    value: '11005900000000000',
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
    address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
    value: '7283399143252128',
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
    address: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
    value: '5063241593207542',
    __typename: 'Wallet',
    transactionsFrom: [],
    transactionsTo: [],
  },
  {
    address: '0x531bcca5bd3323bb5338b6db1dde7532b7299ac1',
    value: '3449053761557226',
    transactionsFrom: [],
    transactionsTo: [],
    __typename: 'Wallet',
  },
  {
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
  },
  {
    address: '0x320a50f32fb9e20fe113573031132c89835e496c',
    value: '1235332924150902',
    transactionsFrom: [
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
          id: '0x320a50f32fb9e20fe113573031132c89835e496c',
          address: '0x320a50f32fb9e20fe113573031132c89835e496c',
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
          id: '0x320a50f32fb9e20fe113573031132c89835e496c',
          address: '0x320a50f32fb9e20fe113573031132c89835e496c',
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
          id: '0x320a50f32fb9e20fe113573031132c89835e496c',
          address: '0x320a50f32fb9e20fe113573031132c89835e496c',
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
          id: '0x320a50f32fb9e20fe113573031132c89835e496c',
          address: '0x320a50f32fb9e20fe113573031132c89835e496c',
          __typename: 'Wallet',
        },
        value: '21500000000000',
        __typename: 'Transaction',
      },
    ],
    transactionsTo: [],
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
