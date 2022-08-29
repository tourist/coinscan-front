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
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import type { DailyHodlersStatesQuery } from '../../generated/graphql';

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

import {
  groupDataMaxByWeeks,
  groupDataMaxByMonths,
  formatMin,
  formatMax,
} from '../../utils/charts';

type FormattedChartData =
  | {
      name: string;
      count: number;
    }[]
  | null;

type HoldersChartProps = {
  groupBy: HodlersChartGroupings;
  data: DailyHodlersStatesQuery | undefined;
  loading?: boolean;
};

const HodlersChart = ({ data, groupBy, loading }: HoldersChartProps) => {
  const theme = useTheme();

  let currentLabelFormatter = HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[groupBy];
  let currentXAxisTickFormatter = HODLERS_CHART_XAXIS_TICK_FORMATTERS[groupBy];

  let formattedData: FormattedChartData = null;

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

  if (loading)
    return (
      <Skeleton
        component="div"
        sx={{ transform: 'none', width: '100%', height: 300 }}
      />
    );

  return formattedData ? (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        {LINE_CHART_GROUPS.includes(groupBy) ? (
          <AreaChart
            width={500}
            height={200}
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              tick={{ dy: 30 }}
              tickFormatter={currentXAxisTickFormatter}
            />
            <YAxis
              scale="linear"
              interval="preserveEnd"
              domain={[
                (dataMin: number) => formatMin(dataMin, 50),
                (dataMax: number) => formatMax(dataMax, 50),
              ]}
            />
            <Tooltip
              content={
                <HoldersChartTooltip labelFormatter={currentLabelFormatter} />
              }
            />
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
              left: 80,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              tick={{ dy: 30 }}
              tickFormatter={currentXAxisTickFormatter}
            />
            <YAxis />
            <Tooltip
              content={
                <HoldersChartTooltip labelFormatter={currentLabelFormatter} />
              }
            />

            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </Box>
  ) : null;
};

type HodlersChartGroupingsProps = {
  loading?: boolean;
  data?: DailyHodlersStatesQuery;
};

const HoldersChartWithGroupings = ({
  data,
  loading,
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

      <HodlersChart data={data} groupBy={chartGrouping} loading={loading} />
    </>
  );
};

export default HoldersChartWithGroupings;
