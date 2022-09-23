import { ApolloError } from '@apollo/client';
import { DailyHoldersStatesQuery } from '../../generated/graphql';
import HoldersGrowth from './HoldersGrowth';

type TotalHoldersProps = {
  loading?: boolean;
  error?: ApolloError;
  data?: DailyHoldersStatesQuery;
};

function getPercentChange(current: number, prev: number): number {
  const percent = (current / prev) * 100 - 100;
  return percent;
}

const TotalHodlers = ({ loading, data }: TotalHoldersProps) => {
  const currentHoldersCount = data?.dailyHoldersStates[0]?.count;
  const oneDayHoldersCount = data?.dailyHoldersStates[1]?.count;
  const sevenDaysHoldersCount = data?.dailyHoldersStates[6]?.count;
  const thirtyDaysHoldersCount = data?.dailyHoldersStates[29]?.count;

  if (
    !currentHoldersCount ||
    !oneDayHoldersCount ||
    !sevenDaysHoldersCount ||
    !thirtyDaysHoldersCount
  ) {
    return null;
  }

  return (
    <HoldersGrowth
      loading={loading}
      holdersCount={currentHoldersCount}
      oneday={getPercentChange(currentHoldersCount, oneDayHoldersCount)}
      sevendays={getPercentChange(currentHoldersCount, sevenDaysHoldersCount)}
      thirtydays={getPercentChange(currentHoldersCount, thirtyDaysHoldersCount)}
    />
  );
};

export default TotalHodlers;
