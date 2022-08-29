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
  expectRowsCountToEqual,
  expectColumnsCountToEqual,
  createMatchMedia,
  theme,
} from '../utils/tests';
import MaterialRemoteTable from './MaterialRemoteTable';
import { ThemeProvider } from '@mui/material';

jest.mock('next/router', () => require('next-router-mock'));

beforeAll(() => {
  window.matchMedia = createMatchMedia(window.innerWidth);
});

beforeEach(() => {
  mockRouter.setCurrentUrl('/');
});

type TestTableData = {
  address: string;
  value: string;
};

const mockResponse: TestTableData[] = [
  {
    address: 'Address 0',
    value: '30000000000000000',
  },
  {
    address: 'Address 1',
    value: '15000000000000000',
  },
  {
    address: 'Address 2',
    value: '13000000000000000',
  },
  {
    address: 'Address 3',
    value: '11005900000000000',
  },
  {
    address: 'Address 4',
    value: '7319042766402946',
  },
  {
    address: 'Address 5',
    value: '5063241593207542',
  },
  {
    address: 'Address 6',
    value: '3476539541373954',
  },
  {
    address: 'Address 7',
    value: '2870259209778666',
  },
  {
    address: 'Address 8',
    value: '1252542089958956',
  },
  {
    address: 'Address 9',
    value: '150000027972734',
  },
  {
    address: 'Address 10',
    value: '112578405711671',
  },
  {
    address: 'Address 11',
    value: '86223923604685',
  },
  {
    address: 'Address 12',
    value: '80680176026938',
  },
];

function setup() {
  const globalFilterFn: FilterFn<TestTableData> = (
    row: Row<TestTableData>,
    columnId: string,
    value: string
  ) => row.getValue(columnId) === value;
  const columnHelper = createColumnHelper<TestTableData>();
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
      header: 'Address',
    }),
    columnHelper.accessor('value', {
      header: 'Amount',
    }),
  ];

  return { columnHelper, defaultColumns, globalFilterFn };
}

test('render material data non remote', async () => {
  const user = userEvent.setup();
  const { globalFilterFn, defaultColumns } = setup();
  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <MaterialRemoteTable
        data={mockResponse}
        loading={false}
        columns={defaultColumns}
        globalFilterFn={globalFilterFn}
        globalFilterField="address"
        globalFilterSearchLabel="Search wallet"
      />
    </ThemeProvider>
  );

  // check first page properly rendered
  const firstRender = asFragment();
  await screen.findAllByText('Address 0');
  expectRowsCountToEqual(10);
  expectColumnsCountToEqual(3);
  expect(firstRender).toMatchSnapshot('non remote data display');

  // move to 2nd page
  const nextPageBtn = await screen.findByLabelText('Go to next page');
  user.click(nextPageBtn);
  await screen.findAllByText('Address 12');
  expectRowsCountToEqual(3);
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
  expectRowsCountToEqual(1);
  expect(snapshotDiff(secondPageRender, globalFilterRender)).toMatchSnapshot(
    'used global filter'
  );

  // use clear button on search input
  user.click((await screen.findAllByRole('button'))[0]);
  await screen.findAllByText('Address 0');
  expectRowsCountToEqual(10);
});

test('global filter is read from url', async () => {
  mockRouter.setCurrentUrl('/?page=1&globalFilter=Address%203');
  const { globalFilterFn, defaultColumns } = setup();

  render(
    <ThemeProvider theme={theme}>
      <MaterialRemoteTable
        data={mockResponse}
        loading={false}
        columns={defaultColumns}
        globalFilterFn={globalFilterFn}
        globalFilterField="address"
        globalFilterSearchLabel="Search wallet"
      />
    </ThemeProvider>
  );
  await screen.findByText('4');
  await screen.findByText('Address 3');
  expect(mockRouter.query).toEqual({ page: '1', globalFilter: 'Address 3' });
  expectRowsCountToEqual(1);
});

test('global pageSize is read from url', async () => {
  mockRouter.setCurrentUrl('/?page=1&pageSize=25');
  const { globalFilterFn, defaultColumns } = setup();

  render(
    <ThemeProvider theme={theme}>
      <MaterialRemoteTable
        data={mockResponse}
        loading={false}
        columns={defaultColumns}
        globalFilterFn={globalFilterFn}
        globalFilterField="address"
        globalFilterSearchLabel="Search wallet"
      />
    </ThemeProvider>
  );
  await screen.findByText('Address 0');
  expect(mockRouter.query).toEqual({ page: '1', pageSize: '25' });
  expectRowsCountToEqual(13);
});

test('changing rows per page', async () => {
  const user = userEvent.setup();
  const { globalFilterFn, defaultColumns } = setup();

  render(
    <ThemeProvider theme={theme}>
      <MaterialRemoteTable
        data={mockResponse}
        loading={false}
        columns={defaultColumns}
        globalFilterFn={globalFilterFn}
        globalFilterField="address"
        globalFilterSearchLabel="Search wallet"
      />
    </ThemeProvider>
  );
  expectRowsCountToEqual(10);
  const rowsPerPage = (await screen.findAllByRole('button'))[1];
  user.click(rowsPerPage);
  const nextRowsPerPage = (await screen.findAllByRole('option'))[1];
  user.click(nextRowsPerPage);
  await screen.findByText('11');
  await screen.findByText('Address 12');
  expect(mockRouter.query).toEqual({ page: 1, pageSize: 25 });
  expectRowsCountToEqual(13);
  user.click(rowsPerPage);
  const backTheRowsPage = (await screen.findAllByRole('option'))[0];
  user.click(backTheRowsPage);
  await waitForElementToBeRemoved(() => screen.queryByText('Address 11'));
  expect(mockRouter.query).toEqual({ page: 1, pageSize: 10 });
  expectRowsCountToEqual(10);
});
