import { render, screen } from '@testing-library/react';

import HoldersChartTooltip, {
  HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS,
} from './HoldersChartTooltip';
import { HodlersChartGroupings } from './consts';

test('HoldersTooltip renders correctly for daily grouping', () => {
  const payload = [
    {
      value: 6293,
    },
  ];

  const { container } = render(
    <HoldersChartTooltip
      active
      label={1654473600}
      payload={payload}
      labelFormatter={
        HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[HodlersChartGroupings.BY_DAY]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});

test('HoldersTooltip renders correctly for weekly grouping', () => {
  const payload = [
    {
      payload: { count: 5393, name: '1638144000' },
      value: 5393,
    },
  ];

  const { container } = render(
    <HoldersChartTooltip
      active
      label={1638144000}
      payload={payload}
      labelFormatter={
        HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[HodlersChartGroupings.BY_WEEK]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});

test('HoldersTooltip renders correctly for monthly grouping', () => {
  const payload = [
    {
      payload: {
        count: 5273,
        name: '1635724800',
      },
      value: 5273,
    },
  ];

  const { container } = render(
    <HoldersChartTooltip
      active
      label={1638144000}
      payload={payload}
      labelFormatter={
        HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[HodlersChartGroupings.BY_MONTH]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});
