import { DailyHodlersStatesQuery } from '../../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import { Loading } from '../wallets/Wallets.styled';
import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/src/component/DefaultTooltipContent';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div>
        {label} : {payload[0].value}
      </div>
    );
  }

  return null;
};

const GET_DAILY_HOLDERS = gql`
  query DailyHodlersStates {
    dailyHoldersStates(orderBy: id, orderDirection: desc) {
      id
      count
    }
  }
`;

type ChartData = { name: string; count: number }[] | null;

const HodlersChart = () => {
  const { loading, error, data } =
    useQuery<DailyHodlersStatesQuery>(GET_DAILY_HOLDERS);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <div>{error.toString()}</div>;

  let formattedData: ChartData = null;

  if (data) {
    formattedData = data?.dailyHoldersStates
      .map((dayData) => {
        return {
          count: dayData.count,
          name: new Date(parseInt(dayData.id) * 1000).toLocaleDateString(),
        };
      })
      .reverse();
  }
  return (
    <div style={{ height: 300 }}>
      {formattedData ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="linear"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

export default HodlersChart;
