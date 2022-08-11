import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';

import { renderWithApolloMocks } from '../utils/tests';
import WalletLink from './WalletLink';
import BalancePercentage from './Wallets/BalancePercentage';
import MaterialRemoteTable from './MaterialRemoteTable';
import { formatValue } from '../utils/formatters';
import { GetWalletsPaginatedQuery } from '../generated/graphql';
import type { Wallet } from './Wallets/Wallets';

jest.mock('next/router', () => require('next-router-mock'));

const mockResponse: GetWalletsPaginatedQuery['wallets'] = [
  {
    address: '0xc6695c80913a37219929ec26f746283842d02cd0',
    value: '30000000000000000',
    __typename: 'Wallet',
  },
  {
    address: '0xf2e4efbcec08d128205d299d6358e7d095eab2f4',
    value: '15000000000000000',
    __typename: 'Wallet',
  },
  {
    address: '0xceeae72d35f5e6fb3e479f0e21eb0f1974146cd4',
    value: '13000000000000000',
    __typename: 'Wallet',
  },
  {
    address: '0x586c21a779c24efd2a8af33c9f7df2a2ea9af55c',
    value: '11005900000000000',
    __typename: 'Wallet',
  },
  {
    address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
    value: '7319042766402946',
    __typename: 'Wallet',
  },
  {
    address: '0xd5a7661d150b41de85a18f756e0fda78c4bb7d0a',
    value: '5063241593207542',
    __typename: 'Wallet',
  },
  {
    address: '0x531bcca5bd3323bb5338b6db1dde7532b7299ac1',
    value: '3476539541373954',
    __typename: 'Wallet',
  },
  {
    address: '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
    value: '2870259209778666',
    __typename: 'Wallet',
  },
  {
    address: '0x320a50f32fb9e20fe113573031132c89835e496c',
    value: '1252542089958956',
    __typename: 'Wallet',
  },
  {
    address: '0x0324577197c97e17c730bbeb0422c5bdf73a82eb',
    value: '150000027972734',
    __typename: 'Wallet',
  },
  {
    address: '0x0d8a7a7e55b964bf0ad48a3fa5cc6668f8bc722b',
    value: '112578405711671',
    __typename: 'Wallet',
  },
  {
    address: '0xb96d0190cb5c8b88e7b10a08b56df34ca7ecd099',
    value: '86223923604685',
    __typename: 'Wallet',
  },
  {
    address: '0xb18083bf3cdc563ff30445497262ef70b761199b',
    value: '80680176026938',
    __typename: 'Wallet',
  },
];

test('render material data non remote', async () => {
  const user = userEvent.setup();

  const MaterialRemoteTableTestWrapper = () => {
    const columnHelper = createColumnHelper<Wallet>();
    const defaultColumns = useMemo(
      () => [
        columnHelper.display({
          id: 'Rank',
          header: 'Rank',
          cell: (info) => {
            const page: number = info.table.getState().pagination.pageIndex + 1;
            const perPage: number = info.table.getState().pagination.pageSize;
            return page && perPage
              ? perPage * (page - 1) + info.row.index + 1
              : info.row.index;
          },
        }),
        columnHelper.accessor('address', {
          header: 'To',
          cell: (info) => <WalletLink walletToLink={info.getValue()} />,
        }),
        columnHelper.accessor('value', {
          id: 'percent',
          header: 'Percent of supply',
          cell: (info) => <BalancePercentage balance={info.getValue()} />,
        }),
        columnHelper.accessor('value', {
          header: 'Amount',
          cell: (info) => formatValue(info.getValue()),
        }),
      ],
      [columnHelper]
    );
    return (
      <MaterialRemoteTable
        data={mockResponse}
        loading={false}
        columns={defaultColumns}
        globalFilterField="address"
        globalFilterSearchLabel="Search wallet"
      />
    );
  };

  const { asFragment } = renderWithApolloMocks(
    <MaterialRemoteTableTestWrapper />,
    {
      mocks: {
        Wallet: () => mockResponse,
      },
    }
  );

  // check first page properly rendered
  const firstRender = asFragment();
  await screen.findAllByText('0x0324577197c97e17c730bbeb0422c5bdf73a82eb');
  await screen.findAllByText('Deployer');
  expect(firstRender).toMatchSnapshot('non remote data display');

  // move to 2nd page
  const nextPageBtn = await screen.findByLabelText('Go to next page');
  user.click(nextPageBtn);
  await screen.findAllByText('0xb18083bf3cdc563ff30445497262ef70b761199b');
  expect(snapshotDiff(firstRender, asFragment())).toMatchSnapshot('2nd page');
});
