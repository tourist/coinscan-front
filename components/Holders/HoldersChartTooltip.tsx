import { TooltipProps, XAxisProps } from 'recharts';
import { Props as DefaultTooltipContentProps } from 'recharts/types/component/DefaultTooltipContent';
import {
  fromUnixTime,
  toLocaleDateStringUTC,
  formatUTC,
  endOfWeek,
} from '../../utils/charts';
import { HodlersChartGroupings } from './consts';

type XAxisTickFormatterFn = XAxisProps['tickFormatter'];

type XAxisTickFormatters = {
  [key in HodlersChartGroupings]: XAxisTickFormatterFn;
};

export const HODLERS_CHART_XAXIS_TICK_FORMATTERS: XAxisTickFormatters = {
  [HodlersChartGroupings.BY_DAY]: (value) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(value, 10))),
  [HodlersChartGroupings.BY_WEEK]: (value) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(value, 10))),
  [HodlersChartGroupings.BY_MONTH]: (value) =>
    formatUTC(fromUnixTime(parseInt(value, 10)), 'MM.YYYY'),
};

type TooltipLabelFormatterFn = DefaultTooltipContentProps<
  string,
  number
>['labelFormatter'];

type TooltipLabelFormatters = {
  [key in HodlersChartGroupings]: TooltipLabelFormatterFn;
};

export const HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS: TooltipLabelFormatters = {
  [HodlersChartGroupings.BY_DAY]: (label: string) =>
    toLocaleDateStringUTC(fromUnixTime(parseInt(label, 10))),
  [HodlersChartGroupings.BY_WEEK]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    const start = toLocaleDateStringUTC(dataDatetime);
    const end = toLocaleDateStringUTC(endOfWeek(dataDatetime));
    return `${start} - ${end}`;
  },
  [HodlersChartGroupings.BY_MONTH]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    return `${formatUTC(dataDatetime, 'MM.YYYY')}`;
  },
};

const HoldersChartTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div style={{ padding: '16px', background: 'rgba(150, 150, 150, 0.97)' }}>
        <span style={{ color: '#ffffff' }}>
          {labelFormatter ? labelFormatter(label, payload) : label}:{' '}
          {payload[0].payload.count}
        </span>
      </div>
    );
  }

  return null;
};

export default HoldersChartTooltip;
