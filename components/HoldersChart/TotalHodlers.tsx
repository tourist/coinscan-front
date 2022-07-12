import { useState } from 'react';
import { TotalHoldersQuery } from '../../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import { Loading } from '../Wallets/Wallets.styled';

const GET_TOTAL_HOLDERS = gql`
  query TotalHolders {
    holdersCounters {
      id
      count
    }
  }
`;

const TotalHodlers = () => {
  const { loading, error, data, fetchMore } =
    useQuery<TotalHoldersQuery>(GET_TOTAL_HOLDERS);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <div>{error.toString()}</div>;

  return (
    <div>
      <span>Total holders: </span>
      {data?.holdersCounters[0]?.count}
    </div>
  );
};

export default TotalHodlers;
