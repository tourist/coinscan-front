import { ApolloError } from '@apollo/client';
// import { TotalHoldersQuery } from '../../generated/graphql';
// import { gql, useQuery } from '@apollo/client';
import { DailyHodlersStatesQuery } from '../../generated/graphql';
import { Loading } from '../Wallets/Wallets.styled';
import Growth from '../Growth';

// const GET_TOTAL_HOLDERS = gql`
//   query TotalHolders {
//     holdersCounters {
//       id
//       count
//     }
//   }
// `;

type TotalHoldersProps = {
  loading?: boolean;
  error?: ApolloError;
  data?: DailyHodlersStatesQuery;
};

function getPercentChange(
  current: number | undefined,
  prev: number | undefined
): number | undefined {
  if (current && prev) {
    const percent = (current / prev) * 100 - 100;
    return percent;
  }

  return;
}

const TotalHodlers = ({ loading, error, data }: TotalHoldersProps) => {
  // const { loading, error, data } =
  //   useQuery<TotalHoldersQuery>(GET_TOTAL_HOLDERS);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <div>{error.toString()}</div>;

  const currentHoldersCount = data?.dailyHoldersStates[0].count;
  const oneDayHoldersCount = data?.dailyHoldersStates[1].count;
  const sevenDaysHoldersCount = data?.dailyHoldersStates[6].count;
  const thirtyDaysHoldersCount = data?.dailyHoldersStates[29].count;

  return (
    <Growth
      value={currentHoldersCount}
      oneday={getPercentChange(currentHoldersCount, oneDayHoldersCount)}
      sevendays={getPercentChange(currentHoldersCount, sevenDaysHoldersCount)}
      thirtydays={getPercentChange(currentHoldersCount, thirtyDaysHoldersCount)}
    />
  );
};

export default TotalHodlers;
