import { screen } from '@testing-library/react';
import snapshotDiff from 'snapshot-diff';

import {
  renderWithApolloMocks,
  expectRowsCountToEqual,
  expectColumnsCountToEqual,
} from '../../utils/tests';
import Transactions from './Transactions';

jest.mock('next/router', () => require('next-router-mock'));

const mockResponse = [
  {
    id: '0x4d4b045d30e88606fe2efd49901569f2b57ac9cc40e2227a3fb4f5d71e7c7bd9-345',
    txn: '0x4d4b045d30e88606fe2efd49901569f2b57ac9cc40e2227a3fb4f5d71e7c7bd9',
    timestamp: '1660773383',
    from: {
      id: '0x09514c763a81789f1fa1b788fea9f2f143f1ab5b',
      address: '0x09514c763a81789f1fa1b788fea9f2f143f1ab5b',
      __typename: 'Wallet',
    },
    to: {
      id: '0x320a50f32fb9e20fe113573031132c89835e496c',
      address: '0x320a50f32fb9e20fe113573031132c89835e496c',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0xf79ba29565cde526c02e74b53b2e9fc603a102aa2b2e09c583eadf0664e465cf-346',
    txn: '0xf79ba29565cde526c02e74b53b2e9fc603a102aa2b2e09c583eadf0664e465cf',
    timestamp: '1660773327',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0x09514c763a81789f1fa1b788fea9f2f143f1ab5b',
      address: '0x09514c763a81789f1fa1b788fea9f2f143f1ab5b',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0xd004b7ac6fcbe963299e55dbe8e49d07aaf01aebe8e90fe9f9a2dbf8aa0d9040-245',
    txn: '0xd004b7ac6fcbe963299e55dbe8e49d07aaf01aebe8e90fe9f9a2dbf8aa0d9040',
    timestamp: '1660773145',
    from: {
      id: '0x41e705394b5d4bf83f654aa48165b268d31703ed',
      address: '0x41e705394b5d4bf83f654aa48165b268d31703ed',
      __typename: 'Wallet',
    },
    to: {
      id: '0x320a50f32fb9e20fe113573031132c89835e496c',
      address: '0x320a50f32fb9e20fe113573031132c89835e496c',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0xc76b765c0a0da177b1cae8bd2cd364332f1cd03057b89ce4fb4cc73b2fb0dd68-98',
    txn: '0xc76b765c0a0da177b1cae8bd2cd364332f1cd03057b89ce4fb4cc73b2fb0dd68',
    timestamp: '1660773085',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0x41e705394b5d4bf83f654aa48165b268d31703ed',
      address: '0x41e705394b5d4bf83f654aa48165b268d31703ed',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0xc04fbc1c67065a03822aaa0de70d988ffaf05a3f290faa213a546714302a2876-170',
    txn: '0xc04fbc1c67065a03822aaa0de70d988ffaf05a3f290faa213a546714302a2876',
    timestamp: '1660772893',
    from: {
      id: '0x12ce2bf7932dc444fb734c1d52e62869970e25bd',
      address: '0x12ce2bf7932dc444fb734c1d52e62869970e25bd',
      __typename: 'Wallet',
    },
    to: {
      id: '0x320a50f32fb9e20fe113573031132c89835e496c',
      address: '0x320a50f32fb9e20fe113573031132c89835e496c',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0xa7954fc0b2b766478bf4fa6a19125cedb301b2fb5ef7db37647cd861560b251e-136',
    txn: '0xa7954fc0b2b766478bf4fa6a19125cedb301b2fb5ef7db37647cd861560b251e',
    timestamp: '1660772841',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0x12ce2bf7932dc444fb734c1d52e62869970e25bd',
      address: '0x12ce2bf7932dc444fb734c1d52e62869970e25bd',
      __typename: 'Wallet',
    },
    value: '15266055024',
    __typename: 'Transaction',
  },
  {
    id: '0x23fed46d4983f614dd3eb3bf8fcafce5036749e83def02d978078d515413e400-184',
    txn: '0x23fed46d4983f614dd3eb3bf8fcafce5036749e83def02d978078d515413e400',
    timestamp: '1660772543',
    from: {
      id: '0xb29090159568c39669a2d40460c160746e95fd76',
      address: '0xb29090159568c39669a2d40460c160746e95fd76',
      __typename: 'Wallet',
    },
    to: {
      id: '0x320a50f32fb9e20fe113573031132c89835e496c',
      address: '0x320a50f32fb9e20fe113573031132c89835e496c',
      __typename: 'Wallet',
    },
    value: '95412843840',
    __typename: 'Transaction',
  },
  {
    id: '0x6be3ab2edaf5241b131ac4cf674ccd89d1592891549607c071b5ddbbcb12cb8a-158',
    txn: '0x6be3ab2edaf5241b131ac4cf674ccd89d1592891549607c071b5ddbbcb12cb8a',
    timestamp: '1660772527',
    from: {
      id: '0x93b6f00363cda7dd2556c6fed6f7bd3cb044bdf9',
      address: '0x93b6f00363cda7dd2556c6fed6f7bd3cb044bdf9',
      __typename: 'Wallet',
    },
    to: {
      id: '0x320a50f32fb9e20fe113573031132c89835e496c',
      address: '0x320a50f32fb9e20fe113573031132c89835e496c',
      __typename: 'Wallet',
    },
    value: '10336391416',
    __typename: 'Transaction',
  },
  {
    id: '0x3df7608bdc4a604b71d9787ca996dfaef2b8ac0745ce9a650df807189a7555bd-171',
    txn: '0x3df7608bdc4a604b71d9787ca996dfaef2b8ac0745ce9a650df807189a7555bd',
    timestamp: '1660772481',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0x93b6f00363cda7dd2556c6fed6f7bd3cb044bdf9',
      address: '0x93b6f00363cda7dd2556c6fed6f7bd3cb044bdf9',
      __typename: 'Wallet',
    },
    value: '10336391416',
    __typename: 'Transaction',
  },
  {
    id: '0x8c809608547269e1000213057eced02d4e559256bd38b9f8d0a45717f790004d-167',
    txn: '0x8c809608547269e1000213057eced02d4e559256bd38b9f8d0a45717f790004d',
    timestamp: '1660772447',
    from: {
      id: '0xc590175e458b83680867afd273527ff58f74c02b',
      address: '0xc590175e458b83680867afd273527ff58f74c02b',
      __typename: 'Wallet',
    },
    to: {
      id: '0x06373719956047a6417b9766eb53181a4fe80fa1',
      address: '0x06373719956047a6417b9766eb53181a4fe80fa1',
      __typename: 'Wallet',
    },
    value: '1511161640461',
    __typename: 'Transaction',
  },
];

test('render Transactions table with data', async () => {
  const { asFragment } = renderWithApolloMocks(<Transactions />, {
    mocks: {
      Query: {
        transactions: () => mockResponse,
      },
    },
  });
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot('loading');
  await screen.findAllByText(
    '0x4d4b045d30e88606fe2efd49901569f2b57ac9cc40e2227a3fb4f5d71e7c7bd9'
  );
  expectColumnsCountToEqual(5);
  expectRowsCountToEqual(10);
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot('loaded');
});
