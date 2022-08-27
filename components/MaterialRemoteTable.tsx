import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { ObservableQuery } from '@apollo/client';
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

type TFetchMore = ObservableQuery['fetchMore'];

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
                <Skeleton />
              </TableCell>
            ))}
        </TableRow>
      ))}
  </>
);

type MaterialRemoteTableProps<TData extends RowData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  fetchMore?: TFetchMore;
  globalFilterFn?: FilterFn<TData>;
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
  globalFilterFn,
  globalFilterHidden,
  globalFilterSearchLabel,
  globalFilterField = 'globalFilter',
  perPage = PER_PAGE_DEFAULT,
}: MaterialRemoteTableProps<TData>) => {
  const router = useRouter();

  type LocalState = Pick<TableState, 'globalFilter' | 'pagination'> & {
    loading?: boolean;
  };
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    undefined
  );
  const [state, setState] = useState<LocalState>({
    loading: loading,
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
      ) ||
      perPage ||
      PER_PAGE_DEFAULT;

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
    router,
    state.pagination,
    state.globalFilter,
    globalFilter,
    fetchMore,
    globalFilterField,
    perPage,
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
    globalFilterFn,
    manualPagination: Boolean(fetchMore),
    manualFiltering: Boolean(fetchMore),
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
                <IconButton onClick={() => onGlobalFilterChange('')}>
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
            {loading && data.length === 0 ? (
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

      {loading ? <LinearProgress /> : null}
      <TablePagination
        component="div"
        onPageChange={onPageChange}
        onRowsPerPageChange={onChangeRowsPerPage}
        page={state.pagination.pageIndex}
        count={fetchMore ? MAX_RECORDS : data.length}
        rowsPerPage={state.pagination.pageSize}
      />
    </>
  );
};

export default MaterialRemoteTable;
