import { TooltipProps, XAxisProps } from 'recharts';
import {
  ValueType,
  NameType,
  Props as DefaultTooltipContentProps,
} from 'recharts/types/component/DefaultTooltipContent';
import {
  fromUnixTime,
  toLocaleDateStringUTC,
  formatUTC,
  endOfWeek,
} from './utils';
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
  ValueType,
  NameType
>['labelFormatter'];

type TooltipLabelFormatters = {
  [key in HodlersChartGroupings]: TooltipLabelFormatterFn;
};

export const HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS: TooltipLabelFormatters = {
  [HodlersChartGroupings.BY_DAY]: (label) =>
    toLocaleDateStringUTC(fromUnixTime(label)),
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
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div>
        {labelFormatter ? labelFormatter(label, payload) : label}:{' '}
        {payload[0].value}
      </div>
    );
  }

  return null;
};

export default HoldersChartTooltip;
