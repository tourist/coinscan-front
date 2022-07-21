import { useState } from 'react';
import { DailyHodlersStatesQuery } from '../../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Loading } from '../Wallets/Wallets.styled';
import HoldersChartTooltip from './HoldersChartTooltip';
import {
  HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS,
  HODLERS_CHART_XAXIS_TICK_FORMATTERS,
} from './HoldersChartTooltip';
import {
  HodlersChartGroupings,
  LINE_CHART_GROUPS,
  BAR_CHART_GROUPS,
} from './consts';
import { groupDataMaxByWeeks, groupDataMaxByMonths } from './utils';

type ChartData = { name: string; count: number }[] | null;

const GET_DAILY_HOLDERS = gql`
  query DailyHodlersStates {
    dailyHoldersStates(orderBy: id, orderDirection: desc, first: 500) {
      id
      count
    }
  }
`;

const HodlersChart = ({ groupBy }: { groupBy: HodlersChartGroupings }) => {
  const theme = useTheme();

  const { loading, error, data } =
    useQuery<DailyHodlersStatesQuery>(GET_DAILY_HOLDERS);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <div>{error.toString()}</div>;

  let currentLabelFormatter = HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[groupBy];
  let currentXAxisTickFormatter = HODLERS_CHART_XAXIS_TICK_FORMATTERS[groupBy];

  let formattedData: ChartData = null;

  if (data) {
    let rawData = data?.dailyHoldersStates;
    switch (groupBy) {
      case HodlersChartGroupings.BY_MONTH:
        rawData = groupDataMaxByMonths(rawData);
        break;
      case HodlersChartGroupings.BY_WEEK:
        rawData = groupDataMaxByWeeks(rawData);
        break;
      default:
        rawData = rawData.slice(0, 89); // by day
    }
    formattedData = rawData
      .map((dayData) => {
        return {
          count: dayData.count,
          name: dayData.id,
        };
      })
      .reverse();
  }
  return (
    <div style={{ height: 300 }}>
      {formattedData ? (
        <>
          {LINE_CHART_GROUPS.includes(groupBy) ? (
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
                <CartesianGrid strokeDasharray="1 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={currentXAxisTickFormatter}
                />
                <YAxis />
                <Tooltip
                  content={
                    <HoldersChartTooltip
                      labelFormatter={currentLabelFormatter}
                    />
                  }
                />
                <Legend />
                <Line
                  type="linear"
                  dataKey="count"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
          {BAR_CHART_GROUPS.includes(groupBy) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                <CartesianGrid strokeDasharray="1 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={currentXAxisTickFormatter}
                />
                <YAxis />
                <Tooltip
                  content={
                    <HoldersChartTooltip
                      labelFormatter={currentLabelFormatter}
                    />
                  }
                />
                <Legend />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

const HoldersChartWithGroupings = () => {
  const [chartGrouping, setChartGrouping] = useState<HodlersChartGroupings>(
    HodlersChartGroupings.BY_DAY
  );

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Total holders per timeframe</Typography>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            disabled={chartGrouping === HodlersChartGroupings.BY_DAY}
            onClick={() => setChartGrouping(HodlersChartGroupings.BY_DAY)}
          >
            By Day
          </Button>
          <Button
            disabled={chartGrouping === HodlersChartGroupings.BY_WEEK}
            onClick={() => setChartGrouping(HodlersChartGroupings.BY_WEEK)}
          >
            By Week
          </Button>
          <Button
            disabled={chartGrouping === HodlersChartGroupings.BY_MONTH}
            onClick={() => setChartGrouping(HodlersChartGroupings.BY_MONTH)}
          >
            By Month
          </Button>
        </ButtonGroup>
      </Box>

      <HodlersChart groupBy={chartGrouping} />
    </>
  );
};

export default HoldersChartWithGroupings;
