import { useMemo } from 'react';
import { scaleLinear as d3_scaleLinear } from 'd3';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { convertBigIntToNumberWithoutDecimalPlacesPrecision } from '../utils/charts';
import settings from '../settings.json';

const HOTNESS_MAX_OF_TOTAL_SUPPLY = 1000;

const TransactionHottness = ({ value }: { value: number }) => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const valueRounded = convertBigIntToNumberWithoutDecimalPlacesPrecision(
    BigInt(value)
  );
  const totalSupply = parseInt(settings.totalSupply);

  const color = useMemo(
    () =>
      d3_scaleLinear<string, number>()
        .domain([
          0,
          totalSupply / HOTNESS_MAX_OF_TOTAL_SUPPLY / 10,
          totalSupply / HOTNESS_MAX_OF_TOTAL_SUPPLY,
          totalSupply,
        ])
        .range([background, '#ffff00', '#ff0000', '#ff0000']),
    [background, totalSupply]
  );
  const radius = useMemo(
    () =>
      d3_scaleLinear<number, number>()
        .domain([0, totalSupply / HOTNESS_MAX_OF_TOTAL_SUPPLY, totalSupply])
        .range([10, 20, 20]),
    [totalSupply]
  );

  const radiusValue = radius(valueRounded);

  return (
    <Box
      style={{
        backgroundColor: color(valueRounded).toString(),
        width: radiusValue,
        height: radiusValue,
      }}
      sx={{
        borderRadius: '50%',
      }}
    />
  );
};

export default TransactionHottness;
