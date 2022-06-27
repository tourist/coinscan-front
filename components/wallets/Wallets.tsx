import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  QueryWalletsArgs,
  Wallet_OrderBy,
  OrderDirection,
  Query,
} from '../../generated/graphql';
import { Loading } from './Wallets.styled';

import WalletsList from './WalletsList';
import { Pagination } from '@mui/material';

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

  console.log('render', pagination);

  const { loading, error, data, fetchMore } = useQuery<Pick<Query, 'wallets'>>(
    GET_WALLETS_PAGINATED,
    {
      variables: {
        ...defaultPagination,
        pagination,
      },
    }
  );

  const onPageClick = async (page: number, fetchMore: any): Promise<void> => {
    const newPagination = {
      ...pagination,
      skip: (page - 1) * perPage,
      page: page,
    };

    setLoadingMore(true);
    await fetchMore({ variables: { ...newPagination } });
    setLoadingMore(false);
    setPagination(newPagination);
  };

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      {loading || loadingMore ? (
        <Loading>Loading...</Loading>
      ) : (
        <WalletsList
          page={pagination.page}
          perPage={PER_PAGE_DEFAULT}
          wallets={data && data.wallets}
        />
      )}
      <Pagination
        onChange={(_: React.ChangeEvent<unknown>, page: number): void => {
          onPageClick(page, fetchMore);
        }}
        count={MAX_RECORDS}
      />
    </div>
  );
};

export default Wallets;
