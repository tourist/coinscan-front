import { createColumnHelper } from '@tanstack/react-table';
import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import snapshotDiff from 'snapshot-diff';
import mockRouter from 'next-router-mock';
import type { FilterFn, Row } from '@tanstack/react-table';

import {
  exceptRowsCountToEqual,
  exceptColumnsCountToEqual,
} from '../utils/tests';
import WalletLink from './WalletLink';
import BalancePercentage from './Wallets/BalancePercentage';
import MaterialRemoteTable from './MaterialRemoteTable';
import { formatValue } from '../utils/formatters';
import { GetWalletsPaginatedQuery } from '../generated/graphql';
import type { Wallet } from './Wallets/Wallets';

jest.mock('next/router', () => require('next-router-mock'));
beforeEach(() => {
  mockRouter.setCurrentUrl('/');
});

const mockResponse: GetWalletsPaginatedQuery['wallets'] = [
  {
    address: 'Address 0',
    value: '30000000000000000',
    __typename: 'Wallet',
  },
  {
    address: 'Address 1',
    value: '15000000000000000',
    __typename: 'Wallet',
  },
  {
    address: 'Address 2',
    value: '13000000000000000',
    __typename: 'Wallet',
  },
  {
    address: 'Address 3',
    value: '11005900000000000',
    __typename: 'Wallet',
  },
  {
    address: 'Address 4',
    value: '7319042766402946',
    __typename: 'Wallet',
  },
  {
    address: 'Address 5',
    value: '5063241593207542',
    __typename: 'Wallet',
  },
  {
    address: 'Address 6',
    value: '3476539541373954',
    __typename: 'Wallet',
  },
  {
    address: 'Address 7',
    value: '2870259209778666',
    __typename: 'Wallet',
  },
  {
    address: 'Address 8',
    value: '1252542089958956',
    __typename: 'Wallet',
  },
  {
    address: 'Address 9',
    value: '150000027972734',
    __typename: 'Wallet',
  },
  {
    address: 'Address 10',
    value: '112578405711671',
    __typename: 'Wallet',
  },
  {
    address: 'Address 11',
    value: '86223923604685',
    __typename: 'Wallet',
  },
  {
    address: 'Address 12',
    value: '80680176026938',
    __typename: 'Wallet',
  },
];

function setup() {
  const globalFilterFn: FilterFn<Wallet> = (
    row: Row<Wallet>,
    columnId: string,
    value: string
  ) => row.getValue(columnId) === value;
  const columnHelper = createColumnHelper<Wallet>();
  const defaultColumns = [
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
  ];

  return { columnHelper, defaultColumns, globalFilterFn };
}

test('render material data non remote', async () => {
  const user = userEvent.setup();
  const { globalFilterFn, defaultColumns } = setup();
  const { asFragment } = render(
    <MaterialRemoteTable
      data={mockResponse}
      loading={false}
      columns={defaultColumns}
      globalFilterFn={globalFilterFn}
      globalFilterField="address"
      globalFilterSearchLabel="Search wallet"
    />
  );

  // check first page properly rendered
  const firstRender = asFragment();
  await screen.findAllByTitle('Address 0');
  exceptRowsCountToEqual(10);
  exceptColumnsCountToEqual(4);
  expect(firstRender).toMatchSnapshot('non remote data display');

  // move to 2nd page
  const nextPageBtn = await screen.findByLabelText('Go to next page');
  user.click(nextPageBtn);
  await screen.findAllByText('Address 12');
  exceptRowsCountToEqual(3);
  const secondPageRender = asFragment();
  expect(mockRouter.query).toEqual({ page: 2 });
  expect(snapshotDiff(firstRender, secondPageRender)).toMatchSnapshot(
    '2nd page'
  );

  // using global filter to test it reset paging to 1
  const globalFilterTestString = 'Address 3';
  const input = await screen.findByLabelText('Search wallet');
  user.type(input, globalFilterTestString);
  await screen.findAllByText(globalFilterTestString);
  const globalFilterRender = asFragment();
  expect(mockRouter.query).toEqual({ page: 1, globalFilter: 'Address 3' });
  exceptRowsCountToEqual(1);
  expect(snapshotDiff(secondPageRender, globalFilterRender)).toMatchSnapshot(
    'used global filter'
  );

  // use clear button on search input
  user.click((await screen.findAllByRole('button'))[0]);
  await screen.findAllByText('Address 0');
  exceptRowsCountToEqual(10);
});

test('global filter is read from url', async () => {
  mockRouter.setCurrentUrl('/?page=1&globalFilter=Address%203');
  const { globalFilterFn, defaultColumns } = setup();

  render(
    <MaterialRemoteTable
      data={[...mockResponse]}
      loading={false}
      columns={defaultColumns}
      globalFilterFn={globalFilterFn}
      globalFilterField="address"
      globalFilterSearchLabel="Search wallet"
    />
  );
  await screen.findByText('Address 3');
  expect(mockRouter.query).toEqual({ page: '1', globalFilter: 'Address 3' });
  exceptRowsCountToEqual(1);
});

test('changing rows per page', async () => {
  const user = userEvent.setup();
  const { globalFilterFn, defaultColumns } = setup();

  render(
    <MaterialRemoteTable
      data={[...mockResponse]}
      loading={false}
      columns={defaultColumns}
      globalFilterFn={globalFilterFn}
      globalFilterField="address"
      globalFilterSearchLabel="Search wallet"
    />
  );
  exceptRowsCountToEqual(10);
  const rowsPerPage = (await screen.findAllByRole('button'))[1];
  user.click(rowsPerPage);
  const nextRowsPerPage = (await screen.findAllByRole('option'))[1];
  user.click(nextRowsPerPage);
  await screen.findByText('Address 12');
  expect(mockRouter.query).toEqual({ page: 1, pageSize: 25 });
  exceptRowsCountToEqual(13);
  user.click(rowsPerPage);
  const backTheRowsPage = (await screen.findAllByRole('option'))[0];
  user.click(backTheRowsPage);
  await waitForElementToBeRemoved(() => screen.queryByText('Address 11'));
  expect(mockRouter.query).toEqual({ page: 1, pageSize: 10 });
  exceptRowsCountToEqual(10);
});
