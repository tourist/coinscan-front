import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import random from 'lodash/random';
import { debounce } from '@mui/material/utils';
import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
  ColumnDef,
  RowData,
  TableState,
  FilterFn,
  getFilteredRowModel,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

import { getValueOrFirstValueFromRouterQueryParam } from '../utils/router';

export const PER_PAGE_DEFAULT = 10;
export const MAX_RECORDS = 5000; // 500 is max skip value for subgraph GraphQL API (for offset pagination)

const getPageAsNumberFromRouterQueryPage = (
  page: string[] | string | undefined
): number =>
  parseInt(getValueOrFirstValueFromRouterQueryParam(page) || '1', 10);

const TableRowsSkeleton = ({ columns }: { columns: number }) => (
  <>
    {Array(10)
      .fill(1)
      .map((_, rowIdx: number) => (
        <TableRow key={rowIdx}>
          {Array(columns)
            .fill(1)
            .map((_, colIdx: number) => (
              <TableCell key={colIdx}>
                <Skeleton
                  style={{
                    maxWidth:
                      process.env.NODE_ENV === 'test'
                        ? undefined
                        : random(100, 350),
                  }}
                />
              </TableCell>
            ))}
        </TableRow>
      ))}
  </>
);

type MaterialRemoteTableProps<TData extends RowData> = {
  columns: ColumnDef<TData, any>[];
  data?: TData[];
  query?: DocumentNode;
  variables?: OperationVariables;
  globalFilterFn?: FilterFn<TData>;
  globalFilterHidden?: boolean;
  globalFilterField?: string;
  globalFilterSearchLabel?: string;
  perPage?: number;
};

const MaterialRemoteTable = <TData extends RowData>({
  columns,
  data,
  query,
  variables,
  globalFilterFn,
  globalFilterHidden,
  globalFilterSearchLabel,
  globalFilterField = 'globalFilter',
  perPage = PER_PAGE_DEFAULT,
}: MaterialRemoteTableProps<TData>) => {
  const client = useApolloClient();
  const router = useRouter();

  type LocalState = Pick<TableState, 'globalFilter' | 'pagination'> & {
    loading: boolean;
    data: TData[];
  };

  const [state, setState] = useState<LocalState>({
    loading: false,
    data: data || [],
    globalFilter: '',
    pagination: {
      pageIndex: 0,
      pageSize: perPage,
    },
  });

  // global filter input display state
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    undefined
  );

  // read router params
  const routerPage: number = getPageAsNumberFromRouterQueryPage(
    router.query.page
  );
  const routerPageSize: number =
    parseInt(
      getValueOrFirstValueFromRouterQueryParam(router.query.pageSize),
      10
    ) ||
    perPage ||
    PER_PAGE_DEFAULT;

  const routerGlobalFilter: string = getValueOrFirstValueFromRouterQueryParam(
    router.query.globalFilter
  );

  // map pagination router params to query variables
  const statePageFromRouter = routerPage - 1;
  const skipParam = statePageFromRouter * routerPageSize;
  const queryParams = useMemo(
    () => ({
      first: routerPageSize,
      skip: skipParam,
    }),
    [routerPageSize, skipParam]
  );

  // set filter input when value read from router
  if (globalFilter === undefined && router.isReady && routerGlobalFilter) {
    setGlobalFilter(routerGlobalFilter);
  }

  const performQuery = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    if (!query) return;

    const { data } = await client.query({
      query,
      variables: {
        ...variables,
        ...queryParams,
        ...(routerGlobalFilter
          ? { [globalFilterField]: routerGlobalFilter }
          : null),
      },
      fetchPolicy: 'network-only',
    });

    setState((prevState) => ({
      ...prevState,
      data: data[Object.keys(data)[0]],
      loading: false,
    }));
  }, [
    client,
    globalFilterField,
    query,
    queryParams,
    routerGlobalFilter,
    variables,
  ]);
  // initial query if query is defined and not data passed
  // if data is passed indicates usage of (ISR) so we skip
  // first query
  useEffect(() => {
    if (router.isReady && query && (!data || data.length === 0)) {
      performQuery();
    }
  }, [router.isReady, performQuery, data, query]);

  // update data and state when route changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      globalFilter: routerGlobalFilter,
      pagination: {
        pageSize: routerPageSize,
        pageIndex: statePageFromRouter,
      },
    }));
  }, [routerGlobalFilter, routerPageSize, statePageFromRouter]);

  // trigger query when router params differs from state
  useEffect(() => {
    if (
      routerPage - 1 !== state.pagination.pageIndex ||
      routerGlobalFilter !== state.globalFilter ||
      routerPageSize !== state.pagination.pageSize
    ) {
      if (query) performQuery();
    }
  }, [
    routerPage,
    routerGlobalFilter,
    routerPageSize,
    state,
    performQuery,
    query,
  ]);

  const onPageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    if (page !== state.pagination.pageIndex) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: page + 1,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const onGlobalFilterChange = useCallback(
    (value: string): void => {
      if (value !== state.globalFilter) {
        setGlobalFilter(value);
        router.push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              page: 1,
              globalFilter: value || null,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router, state.globalFilter]
  );

  const onGlobalFilterChangeDebounced = useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        onGlobalFilterChange(event.target.value ?? undefined);
      }, 250),
    [onGlobalFilterChange]
  );

  const onGlobalFilterTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGlobalFilter(event.target.value);
    onGlobalFilterChangeDebounced(event);
  };

  const onChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextRowsPerPage = parseInt(event.target.value, 10);
    if (nextRowsPerPage !== state.pagination.pageSize) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: 1,
            pageSize: nextRowsPerPage,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const table = useReactTable({
    columns,
    data: state.data,
    state,
    globalFilterFn,
    manualPagination: Boolean(query),
    manualFiltering: Boolean(query),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tableSize = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
    ? 'medium'
    : 'small';

  return (
    <>
      {!globalFilterHidden ? (
        <TextField
          sx={{ width: { xs: '100%', sm: '480px' } }}
          value={globalFilter || ''}
          label={globalFilterSearchLabel}
          onChange={onGlobalFilterTextFieldChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => onGlobalFilterChange('')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : null}

      <TableContainer>
        <Table size={tableSize}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    {...header.getContext().column.columnDef.meta}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {state.loading && state.data.length === 0 ? (
              <TableRowsSkeleton columns={table.getAllColumns().length} />
            ) : null}
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    {...cell.getContext().column.columnDef.meta}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {state.loading ? <LinearProgress /> : null}
      <TablePagination
        component="div"
        onPageChange={onPageChange}
        onRowsPerPageChange={onChangeRowsPerPage}
        page={state.pagination.pageIndex}
        count={
          query
            ? MAX_RECORDS
            : state.data?.length
            ? state.data.length
            : MAX_RECORDS
        }
        rowsPerPage={state.pagination.pageSize}
      />
    </>
  );
};

export default MaterialRemoteTable;
