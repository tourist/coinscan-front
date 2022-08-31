import { render } from '@testing-library/react';

import {
  CHART_TIME_TOOLTIP_LABEL_FORMATTERS,
  ChartTimeGroupings,
} from '../../utils/charts';
import BasicTooltip from './BasicTooltip';

test('HoldersTooltip renders correctly for daily grouping', () => {
  const payload = [
    {
      payload: { count: 6293, name: '1638144000' },
    },
  ];

  const { container } = render(
    <BasicTooltip
      active
      label={1654473600}
      payload={payload}
      labelFormatter={
        CHART_TIME_TOOLTIP_LABEL_FORMATTERS[ChartTimeGroupings.BY_DAY]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});

test('HoldersTooltip renders correctly for weekly grouping', () => {
  const payload = [
    {
      payload: { count: 5393, name: '1638144000' },
    },
  ];

  const { container } = render(
    <BasicTooltip
      active
      label={payload[0].payload.name}
      payload={payload}
      labelFormatter={
        CHART_TIME_TOOLTIP_LABEL_FORMATTERS[ChartTimeGroupings.BY_WEEK]
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
    },
  ];

  const { container } = render(
    <BasicTooltip
      active
      label={payload[0].payload.name}
      payload={payload}
      labelFormatter={
        CHART_TIME_TOOLTIP_LABEL_FORMATTERS[ChartTimeGroupings.BY_MONTH]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});
