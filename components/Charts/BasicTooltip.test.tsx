import { render, screen } from '@testing-library/react';

import { HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS } from '../../components/Holders/HoldersChartTooltip';
import { HodlersChartGroupings } from '../../components/Holders/consts';
import BasicTooltip from './BasicTooltip';

test('BalanceChartTooltip renders correctly for daily grouping', () => {
  const payload = [
    {
      payload: {
        display: BigInt(123456789112345678),
        count: 123456789112345678,
        id: '1635724800',
      },
    },
  ];

  const { container } = render(
    <BasicTooltip
      active
      label={payload[0].payload.id}
      payload={payload}
      labelFormatter={
        HODLERS_CHART_TOOLTIP_LABEL_FORMATTERS[HodlersChartGroupings.BY_DAY]
      }
    />
  );

  expect(container).toMatchSnapshot('rendered');
});
