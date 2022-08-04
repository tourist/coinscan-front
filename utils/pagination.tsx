import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table } from '@tanstack/table-core';

const getPageForStateFromRouterQueryPage = (page: unknown): number =>
  parseInt((Array.isArray(page) ? page[0] : page) || '1', 10);

export const useTanstackTableRoutedPagination = <TData,>(
  table: Table<TData>,
  onPageChange?: (page: number) => Promise<void>
): {
  page: number;
  changePage: (_: React.ChangeEvent<unknown>, page: number) => void;
} => {
  const router = useRouter();
  const routerPage = getPageForStateFromRouterQueryPage(router?.query?.page);

  useEffect(() => {
    table.setPageIndex(routerPage - 1);
    if (onPageChange) {
      onPageChange(routerPage);
    }
  }, [routerPage, table, onPageChange]);

  const changePage = (_: React.ChangeEvent<unknown>, page: number): void => {
    router?.push(
      {
        pathname: router.pathname,
        query: { ...router?.query, page: page },
      },
      undefined,
      { shallow: true }
    );
  };

  return {
    page: onPageChange
      ? getPageForStateFromRouterQueryPage(router?.query?.page)
      : table.getState().pagination.pageIndex + 1,
    changePage,
  };
};
