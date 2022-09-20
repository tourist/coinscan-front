import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { debounce } from '@mui/material/utils';
import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
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
export const MAX_RECORDS = 5000; // 500 is max skip value for subgraph GraphQL API (for offset pagination)

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
  globalFilterHidden?: boolean;
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
  globalFilterHidden,
  globalFilterSearchLabel,
  globalFilterField = 'globalFilter',
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
        <MaterialTableGlobalFilter
          {...{
            onGlobalFilterChange,
            onGlobalFilterTextFieldChange,
            globalFilter,
            globalFilterField,
            globalFilterSearchLabel,
          }}
        />
      ) : null}

      <MaterialTableContent table={table} tableSize={tableSize} state={state} />

      {state.loading ? <LinearProgress /> : null}
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
