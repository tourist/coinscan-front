import { extent as d3_extent } from 'd3';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material';

import {
  CHART_TIME_TOOLTIP_LABEL_FORMATTERS,
  CHART_TIME_XAXIS_TICK_FORMATTERS,
  ChartTimeGroupings,
  DataPointWithDisplay,
  formatMax,
} from '../../utils/charts';
import BasicTooltip from '../Charts/BasicTooltip';
import { formatValue } from '../../utils/formatters';

const WalletTransactionsInOutChart = ({
  chartData,
}: {
  chartData: DataPointWithDisplay<bigint>[];
}) => {
  const theme = useTheme();
  const DATA_EXTENT = d3_extent(chartData, (d) => d.count);

  if (DATA_EXTENT[0] === undefined || DATA_EXTENT[1] === undefined) {
    return null;
  }

  const DATA_MAX = DATA_EXTENT[1];
  const DATA_MIN = DATA_EXTENT[0];
  const SIDE_MAX = Math.max(Math.abs(DATA_MIN), Math.abs(DATA_MAX));
  const Y_DOMAIN_MAX = formatMax(SIDE_MAX, 100);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          fontSize="0.875rem"
          dataKey="id"
          angle={-45}
          tick={{ dy: 30 }}
          tickFormatter={
            CHART_TIME_XAXIS_TICK_FORMATTERS[ChartTimeGroupings.BY_DAY]
          }
        />
        <YAxis
          fontSize="0.875rem"
          scale="linear"
          ticks={[
            0,
            Y_DOMAIN_MAX / 4,
            Y_DOMAIN_MAX / 2,
            (Y_DOMAIN_MAX / 4) * 3,
            Y_DOMAIN_MAX,
          ]}
          tickFormatter={(value) => formatValue(value, { notation: 'compact' })}
        />
        <Tooltip
          content={
            <BasicTooltip
              labelFormatter={
                CHART_TIME_TOOLTIP_LABEL_FORMATTERS[ChartTimeGroupings.BY_DAY]
              }
            />
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
    </ResponsiveContainer>
  );
};

export default WalletTransactionsInOutChart;
