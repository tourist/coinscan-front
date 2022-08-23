import { useState } from 'react';

import {
  AreaChart,
  Area,
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
import { DailyHodlersStatesQuery } from '../../generated/graphql';
import { groupDataMaxByWeeks, groupDataMaxByMonths } from './utils';
import { ApolloError } from '@apollo/client';

export type HodlersChartData = DailyHodlersStatesQuery['dailyHoldersStates'];

type FormattedChartData =
  | {
      name: string;
      count: number;
    }[]
  | null;

type HoldersChartProps = {
  groupBy: HodlersChartGroupings;
  data: DailyHodlersStatesQuery;
};

const HodlersChart = ({ data, groupBy }: HoldersChartProps) => {
  const theme = useTheme();

  let currentLabelFormatter = HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[groupBy];
  let currentXAxisTickFormatter = HODLERS_CHART_XAXIS_TICK_FORMATTERS[groupBy];

  let formattedData: FormattedChartData = null;

  const formatMin = (dataMin: number, roundingBase: number = 20) => {
    return dataMin - (roundingBase + (dataMin % roundingBase));
  };

  const formatMax = (dataMax: number, roundingBase: number = 20) => {
    return dataMax + (roundingBase - (dataMax % roundingBase));
  };

  if (data) {
    let rawData = data.dailyHoldersStates;
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
  return formattedData ? (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        {LINE_CHART_GROUPS.includes(groupBy) ? (
          <AreaChart
            width={500}
            height={200}
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="name" tickFormatter={currentXAxisTickFormatter} />
            <YAxis
              scale="linear"
              interval="preserveEnd"
              domain={[
                (dataMin: number) => formatMin(dataMin),
                (dataMax: number) => formatMax(dataMax),
              ]}
            />
            <Tooltip
              content={
                <HoldersChartTooltip labelFormatter={currentLabelFormatter} />
              }
            />
            <Legend />
            <Area
              type="linear"
              dataKey="count"
              activeDot={{ r: 1 }}
              fill={theme.palette.primary.main}
              fillOpacity={0.7}
            />
          </AreaChart>
        ) : BAR_CHART_GROUPS.includes(groupBy) ? (
          <BarChart
            width={500}
            height={200}
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="name" tickFormatter={currentXAxisTickFormatter} />
            <YAxis />
            <Tooltip
              content={
                <HoldersChartTooltip labelFormatter={currentLabelFormatter} />
              }
            />
            <Legend />
            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </div>
  ) : null;
};

type HodlersChartGroupingsProps = {
  loading?: boolean;
  error?: ApolloError;
  data?: DailyHodlersStatesQuery;
};

const HoldersChartWithGroupings = ({
  data,
  loading,
  error,
}: HodlersChartGroupingsProps) => {
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

      {!loading && data ? (
        <HodlersChart data={data} groupBy={chartGrouping} />
      ) : (
        <Loading>Loading...</Loading>
      )}
    </>
  );
};

export default HoldersChartWithGroupings;
