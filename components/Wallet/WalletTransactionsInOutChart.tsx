import { extent as d3_extent } from 'd3';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';

import { formatValue } from '../../utils/formatters';
import { HodlersChartGroupings } from '../Holders/consts';
import {
  HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS,
  HODLERS_CHART_XAXIS_TICK_FORMATTERS,
} from '../Holders/HoldersChartTooltip';
import { DataPoint, formatMin, formatMax } from '../../utils/charts';
import settings from '../../settings.json';

export const WalletTransactionsInOutTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length > 0) {
    return (
      <Box
        sx={{
          padding: '16px',
          background: 'rgba(150, 150, 150, 0.97)',
          color: '#ffffff',
        }}
      >
        {labelFormatter ? labelFormatter(label, payload) : label}:{' '}
        {formatValue(BigInt(payload[0].payload.count || 0))}
      </Box>
    );
  }
  return null;
};

const WalletTransactionsInOutChart = ({
  chartData,
}: {
  chartData: DataPoint<number>[];
}) => {
  const DATA_EXTENT = d3_extent(chartData, (d) => Number(d.count));

  if (DATA_EXTENT[0] === undefined || DATA_EXTENT[1] === undefined) {
    return null;
  }

  const DATA_MAX = DATA_EXTENT[1];
  const DATA_MIN = DATA_EXTENT[0];
  const SIDE_MAX = Math.max(Math.abs(DATA_MIN), Math.abs(DATA_MAX));
  const Y_DOMAIN_MIN = formatMin(
    -SIDE_MAX,
    Math.pow(10, settings.decimalPlaces + 2)
  );
  const Y_DOMAIN_MAX = formatMax(
    SIDE_MAX,
    Math.pow(10, settings.decimalPlaces + 2)
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          dataKey="id"
          interval="preserveEnd"
          angle={-45}
          tick={{ dy: 30 }}
          tickFormatter={
            HODLERS_CHART_XAXIS_TICK_FORMATTERS[HodlersChartGroupings.BY_DAY]
          }
        />
        <YAxis
          tickFormatter={formatValue}
          allowDecimals={false}
          ticks={[
            Y_DOMAIN_MIN,
            Y_DOMAIN_MIN / 2,
            0,
            Y_DOMAIN_MAX / 2,
            Y_DOMAIN_MAX,
          ]}
          domain={[Y_DOMAIN_MIN, Y_DOMAIN_MAX]}
        />
        <ReferenceLine y={0} stroke="#fff" />
        <Tooltip
          content={
            <WalletTransactionsInOutTooltip
              labelFormatter={
                HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[
                  HodlersChartGroupings.BY_DAY
                ]
              }
            />
          }
        />
        <Bar dataKey="count">
          {chartData.map((entry, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={BigInt(entry['count']) > BigInt(0) ? 'green' : 'tomato'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WalletTransactionsInOutChart;
