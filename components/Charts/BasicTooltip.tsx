import type { TooltipProps } from 'recharts';
import Box from '@mui/material/Box';

import { formatValue } from '../../utils/formatters';

const BasicTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length > 0) {
    return (
      <Box
        sx={{
          translate: ['0 -40px', '0 0'],
          p: [0.5, 2],
          fontSize: ['0.75rem', 'body2.fontSize'],
          color: 'white',
          backgroundColor: 'grey.500',
        }}
      >
        {labelFormatter ? labelFormatter(label, payload) : label}:{' '}
        {formatValue(payload[0].payload.display || 0)}
      </Box>
    );
  }
  return null;
};

export default BasicTooltip;
