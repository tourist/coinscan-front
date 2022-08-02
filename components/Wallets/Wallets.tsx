import { useCallback, useState, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import {
  QueryWalletsArgs,
  Wallet_OrderBy,
  OrderDirection,
  GetWalletsPaginatedQuery,
} from '../../generated/graphql';
import { Pagination } from '@mui/material';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import WalletLink from './WalletLink';
import BalancePercentage from './BalancePercentage';
import { Loading } from './Wallets.styled';
import WalletsList from './WalletsList';
import { useTanstackTableRoutedPagination } from '../../utils/pagination';

const MAX_RECORDS = 500; // 500 is max skip value for subgraph GraphQL API (for offset pagination)
const PER_PAGE_DEFAULT = 10;

type WalletsPaginatedVars = Pick<
  QueryWalletsArgs,
  'orderDirection' | 'orderBy' | 'first' | 'skip'
>;

const GET_WALLETS_PAGINATED = gql`
  query GetWalletsPaginated(
    $first: Int!
    $skip: Int!
    $orderBy: Wallet_orderBy!
    $orderDirection: OrderDirection!
  ) {
    wallets(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
    ) {
      id
      address
      value
    }
  }
`;

export type Wallet = NonNullable<GetWalletsPaginatedQuery['wallets']>[0];

const Wallets = () => {
  const perPage = PER_PAGE_DEFAULT;

  type PaginationState = WalletsPaginatedVars & { page: number };
  const defaultPagination: PaginationState = {
    first: perPage,
    skip: 1,
    orderBy: Wallet_OrderBy.Value,
    orderDirection: OrderDirection.Desc,
    page: 1,
  };
  const [pagination, setPagination] = useState(defaultPagination);
  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, error, data, fetchMore } =
    useQuery<GetWalletsPaginatedQuery>(GET_WALLETS_PAGINATED, {
      variables: {
        ...defaultPagination,
        pagination,
      },
    });

  const onPageChange = useCallback(
    async (page: number): Promise<void> => {
      const newPagination = {
        ...pagination,
        skip: (page - 1) * perPage + 1,
        page: page,
      };
      if (pagination.page !== page) {
        setLoadingMore(true);
        await fetchMore({ variables: { ...newPagination } });
        setLoadingMore(false);
        setPagination(newPagination);
      }
    },
    [fetchMore, pagination, perPage]
  );

  const columnHelper = createColumnHelper<Wallet>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.display({
        id: 'Rank',
        header: 'Rank',
        cell: (info) => {
          const page: number = info.table.getState().pagination.pageIndex + 1;

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
        header: 'Percent of supply',
        cell: (info) => <BalancePercentage balance={info.getValue()} />,
      }),
      columnHelper.accessor('value', {
        header: 'Amount',
        cell: (info) => utils.formatUnits(info.getValue(), 8),
      }),
    ],
    [columnHelper, perPage]
  );

  const table = useReactTable({
    data: (data && data.wallets) || [],
    columns: defaultColumns,
    autoResetPageIndex: false,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: PER_PAGE_DEFAULT,
      },
    },
  });

  const { page, changePage } = useTanstackTableRoutedPagination<Wallet>(
    table,
    onPageChange
  );

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      {loading || loadingMore ? (
        <Loading>Loading...</Loading>
      ) : (
        <WalletsList table={table} />
      )}
      <Pagination onChange={changePage} page={page} count={MAX_RECORDS} />
    </div>
  );
};

export default Wallets;
