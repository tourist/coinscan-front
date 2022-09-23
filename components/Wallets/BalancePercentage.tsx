import { utils } from 'ethers';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import settings from '../../settings.json';

export const getBalancePercentage = (
  balance: string | bigint | number,
  precision: number = 4
) => {
  balance = BigInt(balance);
  const totalSupply = utils
    .parseUnits(settings.totalSupply, settings.decimalPlaces)
    .toBigInt();
  const percent =
    (balance * BigInt(100 * Math.pow(10, precision))) / totalSupply;
  return Number(percent) / Math.pow(10, precision);
};

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: 75, mr: 1 }}>
        <LinearProgress
          aria-label="Percent of supply"
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}

const BalancePercentage = ({ balance }: { balance: string }) => {
  return (
    <LinearProgressWithLabel
      variant="determinate"
      value={getBalancePercentage(balance)}
    />
  );
};

export default BalancePercentage;
