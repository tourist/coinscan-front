import { useMemo } from 'react';
import { scaleLinear as d3_scaleLinear } from 'd3';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import settings from '../settings.json';

const HOTNESS_MAX_OF_TOTAL_SUPPLY = 1 / 5000;

const TransactionHottness = ({ value }: { value: number }) => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const color = useMemo(
    () =>
      d3_scaleLinear<string, number>()
        .domain([
          0,
          parseInt(settings.totalSupply, 10) *
            Math.pow(10, settings.decimalPlaces) *
            HOTNESS_MAX_OF_TOTAL_SUPPLY,
        ])
        .range([background, '#ff0000']),
    [background]
  );

  return (
    <Box
      style={{ backgroundColor: color(value).toString() }}
      sx={{
        borderRadius: '50%',
        width: 40,
        height: 40,
      }}
    />
  );
};

export default TransactionHottness;
