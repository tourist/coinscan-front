import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { ColumnDef, RowData, TableState } from '@tanstack/react-table';
import type { ObservableQuery } from '@apollo/client';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Loading } from './Wallets/Wallets.styled';

export const PER_PAGE_DEFAULT = 10;
export const MAX_RECORDS = 5000; // 500 is max skip value for subgraph GraphQL API (for offset pagination)

const getValueOrFirstValueFromRouterQueryParam = (
  value: string[] | string | undefined
): string => (Array.isArray(value) ? value[0] : value ? value : '');

const getPageAsNumberFromRouterQueryPage = (
  page: string[] | string | undefined
): number =>
  parseInt(getValueOrFirstValueFromRouterQueryParam(page) || '1', 10);

type TFetchMore = ObservableQuery['fetchMore'];

type MaterialRemoteTableProps<TData extends RowData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  fetchMore?: TFetchMore;
  globalFilterHidden?: boolean;
  globalFilterField?: string;
  globalFilterSearchLabel?: string;
  perPage?: number;
};

const MaterialRemoteTable = <TData extends unknown>({
  columns,
  data,
  loading,
  fetchMore,
  globalFilterHidden,
  globalFilterSearchLabel,
  globalFilterField = 'globalFilter',
  perPage = PER_PAGE_DEFAULT,
}: MaterialRemoteTableProps<TData>) => {
  const router = useRouter();

  type LocalState = Pick<TableState, 'globalFilter' | 'pagination'>;
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    undefined
  );
  const [state, setState] = useState<LocalState>({
    globalFilter: '',
    pagination: {
      pageIndex: 0,
      pageSize: perPage,
    },
  });

  useEffect(() => {
    const routerPage: number = getPageAsNumberFromRouterQueryPage(
      router.query.page
    );
    const routerPageSize: number =
      parseInt(
        getValueOrFirstValueFromRouterQueryParam(router.query.pageSize),
        10
      ) || PER_PAGE_DEFAULT;

    const routerGlobalFilter: string = getValueOrFirstValueFromRouterQueryParam(
      router.query.globalFilter
    );

    // set filter input when value read from router
    if (globalFilter === undefined && routerGlobalFilter) {
      setGlobalFilter(routerGlobalFilter);
    }

    // update data and state when route changes
    if (
      routerPage - 1 !== state.pagination.pageIndex ||
      routerGlobalFilter !== state.globalFilter ||
      routerPageSize !== state.pagination.pageSize
    ) {
      const statePageFromRouter = routerPage - 1;
      const skipParam = statePageFromRouter * routerPageSize;

      const queryParams = {
        first: routerPageSize,
        skip: skipParam,
      };

      const fetchMoreAsync = async (fetchMore: TFetchMore) => {
        const variables = {
          ...queryParams,
          [globalFilterField]: routerGlobalFilter,
        };
        await fetchMore({ variables });
      };

      setState((prev) => ({
        ...prev,
        globalFilter: routerGlobalFilter,
        pagination: {
          pageSize: routerPageSize,
          pageIndex: statePageFromRouter,
        },
      }));

      fetchMore && fetchMoreAsync(fetchMore);
    }
  }, [
    router.query,
    router.isReady,
    state.pagination,
    state.globalFilter,
    globalFilter,
    fetchMore,
    globalFilterField,
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
    data,
    state,
    manualPagination: Boolean(fetchMore),
    manualFiltering: Boolean(fetchMore),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {!globalFilterHidden ? (
        <TextField
          value={globalFilter}
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
                <ClearIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onGlobalFilterChange('')}
                />
              </InputAdornment>
            ),
          }}
        />
      ) : null}

      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {state?.pagination ? (
        <TablePagination
          component="div"
          onPageChange={onPageChange}
          onRowsPerPageChange={onChangeRowsPerPage}
          page={state.pagination.pageIndex}
          count={fetchMore ? MAX_RECORDS : data.length}
          rowsPerPage={state.pagination.pageSize}
        />
      ) : null}
    </>
  );
};

export default MaterialRemoteTable;
