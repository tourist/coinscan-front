import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  QueryWalletsArgs,
  Wallet_OrderBy,
  OrderDirection,
  GetWalletsPaginatedQuery,
} from '../../generated/graphql';
import { Pagination } from '@mui/material';
import { Loading } from './Wallets.styled';
import WalletsList from './WalletsList';

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
  const [loadingPage, setLoadingPage] = useState(false);

  const { loading, error, data, fetchMore } =
    useQuery<GetWalletsPaginatedQuery>(GET_WALLETS_PAGINATED, {
      variables: {
        ...defaultPagination,
        pagination,
      },
    });

  const onPageChange = async (page: number): Promise<void> => {
    const newPagination = {
      ...pagination,
      skip: (page - 1) * perPage + 1,
      page: page,
    };

    setLoadingPage(true);
    await fetchMore({ variables: { ...newPagination } });
    setLoadingPage(false);
    setPagination(newPagination);
  };

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      {loading || loadingPage ? (
        <Loading>Loading...</Loading>
      ) : (
        <WalletsList
          page={pagination.page}
          perPage={PER_PAGE_DEFAULT}
          wallets={data && data.wallets}
        />
      )}
      <Pagination
        onChange={(_, page): void => {
          onPageChange(page);
        }}
        count={MAX_RECORDS}
      />
    </div>
  );
};

export default Wallets;
