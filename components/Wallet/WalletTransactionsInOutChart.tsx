import { extent as d3_extent } from 'd3';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { formatValue } from '../../utils/formatters';
import {
  ChartTimeGroupings,
  CHART_TIME_TOOLTIP_LABEL_FORMATTERS,
  CHART_TIME_XAXIS_TICK_FORMATTERS,
} from '../../utils/charts';
import BasicTooltip from '../Charts/BasicTooltip';
import { formatMin, formatMax, DataPointWithDisplay } from '../../utils/charts';

const WalletTransactionsInOutChart = ({
  chartData,
}: {
  chartData: DataPointWithDisplay<bigint>[];
}) => {
  const DATA_EXTENT = d3_extent(chartData, (d) => d.count);

  if (DATA_EXTENT[0] === undefined || DATA_EXTENT[1] === undefined) {
    return null;
  }

  const DATA_MAX = DATA_EXTENT[1];
  const DATA_MIN = DATA_EXTENT[0];
  const SIDE_MAX = Math.max(Math.abs(DATA_MIN), Math.abs(DATA_MAX));
  const Y_DOMAIN_MIN = formatMin(-SIDE_MAX, 100);
  const Y_DOMAIN_MAX = formatMax(SIDE_MAX, 100);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          fontSize="0.875rem"
          dataKey="id"
          interval="preserveEnd"
          angle={-45}
          tick={{ dy: 30 }}
          tickFormatter={
            CHART_TIME_XAXIS_TICK_FORMATTERS[ChartTimeGroupings.BY_DAY]
          }
        />
        <YAxis
          fontSize="0.875rem"
          tickFormatter={(value) => formatValue(value, { notation: 'compact' })}
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
            <BasicTooltip
              labelFormatter={
                CHART_TIME_TOOLTIP_LABEL_FORMATTERS[ChartTimeGroupings.BY_DAY]
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
