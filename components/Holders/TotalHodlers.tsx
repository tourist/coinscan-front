import { ApolloError } from '@apollo/client';
import { DailyHodlersStatesQuery } from '../../generated/graphql';
import { Loading } from '../Wallets/Wallets.styled';
import Growth from '../Growth';

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
}

const TotalHodlers = ({ loading, data }: TotalHoldersProps) => {
  const currentHoldersCount = data?.dailyHoldersStates[0].count;
  const oneDayHoldersCount = data?.dailyHoldersStates[1].count;
  const sevenDaysHoldersCount = data?.dailyHoldersStates[6].count;
  const thirtyDaysHoldersCount = data?.dailyHoldersStates[29].count;

  return (
    <Growth
      loading={loading}
      value={currentHoldersCount}
      oneday={getPercentChange(currentHoldersCount, oneDayHoldersCount)}
      sevendays={getPercentChange(currentHoldersCount, sevenDaysHoldersCount)}
      thirtydays={getPercentChange(currentHoldersCount, thirtyDaysHoldersCount)}
    />
  );
};

export default TotalHodlers;
