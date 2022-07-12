import { TooltipProps } from 'recharts';
import { endOfWeek, fromUnixTime, format, parse } from 'date-fns';
import { XAxisProps } from 'recharts';
import {
  ValueType,
  NameType,
  Props as DefaultTooltipContentProps,
} from 'recharts/types/component/DefaultTooltipContent';
import { HodlersChartGroupings } from './consts';

type XAxisTickFormatterFn = XAxisProps['tickFormatter'];

type XAxisTickFormatters = {
  [key in HodlersChartGroupings]: XAxisTickFormatterFn;
};

const getLocaleDateStringFromUnixTime = (value: string) =>
  fromUnixTime(parseInt(value, 10)).toLocaleDateString();

export const HODLERS_CHART_XAXIS_TICK_FORMATTERS: XAxisTickFormatters = {
  [HodlersChartGroupings.BY_DAY]: (value) =>
    getLocaleDateStringFromUnixTime(value),
  [HodlersChartGroupings.BY_WEEK]: (value) =>
    getLocaleDateStringFromUnixTime(value),
  [HodlersChartGroupings.BY_MONTH]: (value) => {
    return format(fromUnixTime(parseInt(value, 10)), 'MM.y');
  },
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
    getLocaleDateStringFromUnixTime(label),
  [HodlersChartGroupings.BY_WEEK]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    const start = dataDatetime.toLocaleDateString();
    const end = endOfWeek(dataDatetime, {
      weekStartsOn: 1,
    }).toLocaleDateString();
    return `${start} - ${end}`;
  },
  [HodlersChartGroupings.BY_MONTH]: (_, payload) => {
    const dataDatetime = fromUnixTime(parseInt(payload[0].payload.name, 10));
    const formattedDate = format(dataDatetime, 'MM.y');
    return `${formattedDate}`;
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
