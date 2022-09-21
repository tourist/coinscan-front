import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';
import {
  ColumnDef,
  TableState,
  FilterFn,
  getFilteredRowModel,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

import { getValueOrFirstValueFromRouterQueryParam } from '../../utils/router';
import MaterialTableContent from './MaterialTableContent';
import MaterialTableGlobalFilter from './MaterialTableGlobalFilter';

export const PER_PAGE_DEFAULT = 10;
export const MAX_RECORDS = 5000; // 5000 is max value for subgraph GraphQL API pagination (using first/skip)
const getPageAsNumberFromRouterQueryPage = (
  page: string[] | string | undefined
): number =>
  parseInt(getValueOrFirstValueFromRouterQueryParam(page) || '1', 10);

type MaterialTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data?: TData[];
  query?: DocumentNode;
  variables?: OperationVariables;
  globalFilterFn?: FilterFn<TData>;
  globalFilterField?: string;
  globalFilterSearchLabel?: string;
  perPage?: number;
};

export type LocalState<TData> = Pick<
  TableState,
  'globalFilter' | 'pagination'
> & {
  loading: boolean;
  data: TData[];
};

const MaterialTable = <TData extends unknown>({
  columns,
  data,
  query,
  variables,
  globalFilterFn,
  globalFilterSearchLabel,
  globalFilterField = '',
  perPage = PER_PAGE_DEFAULT,
}: MaterialTableProps<TData>) => {
  const client = useApolloClient();
  const router = useRouter();

  const [state, setState] = useState({
    loading: false,
    data: data || [],
    globalFilter: '',
    pagination: {
      pageIndex: 0,
      pageSize: perPage,
    },
  });

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

  const performQuery = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    if (!query) return;

    const { data } = await client.query<{ [key: string]: TData[] }>({
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
  // first query and use provided data
  useEffect(() => {
    if (router.isReady && query && (!data || data.length === 0)) {
      performQuery();
    }
  }, [router.isReady, performQuery, data, query]);

  // trigger query when router params differs from state
  useEffect(() => {
    if (
      statePageFromRouter !== state.pagination.pageIndex ||
      routerGlobalFilter !== state.globalFilter ||
      routerPageSize !== state.pagination.pageSize
    ) {
      if (query) performQuery();

      setState((prev) => ({
        ...prev,
        globalFilter: routerGlobalFilter,
        pagination: {
          pageSize: routerPageSize,
          pageIndex: statePageFromRouter,
        },
      }));
    }
  }, [
    statePageFromRouter,
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
        { shallow: true, scroll: false }
      );
    }
  };

  const onGlobalFilterChange = useCallback(
    (value: string): void => {
      if (value !== state.globalFilter) {
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
          { shallow: true, scroll: false }
        );
      }
    },
    [router, state.globalFilter]
  );

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
        { shallow: true, scroll: false }
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
      {globalFilterField ? (
        <MaterialTableGlobalFilter
          loading={state.loading}
          globalFilter={state.globalFilter}
          onGlobalFilterChange={onGlobalFilterChange}
          globalFilterSearchLabel={globalFilterSearchLabel}
        />
      ) : null}

      <Box sx={{ height: 5, mt: 2 }}>
        {state.loading ? <LinearProgress /> : null}
      </Box>

      <MaterialTableContent table={table} tableSize={tableSize} state={state} />

      <Box sx={{ height: 5 }}>{state.loading ? <LinearProgress /> : null}</Box>

      <TablePagination
        component="div"
        onPageChange={onPageChange}
        onRowsPerPageChange={onChangeRowsPerPage}
        page={state.pagination.pageIndex}
        count={query ? MAX_RECORDS : state.data.length}
        rowsPerPage={state.pagination.pageSize}
      />
    </>
  );
};

export default MaterialTable;
