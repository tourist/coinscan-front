import { utils } from 'ethers';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import settings from '../../settings.json';

const balancePercentage = (value: string) => {
  const balance = BigInt(value) * BigInt(1000000);
  const totalSupply = utils
    .parseUnits(settings.totalSupply, settings.decimalPlaces)
    .toBigInt();
  const percent = balance / totalSupply;
  // 4-digit precision
  return Number(percent) / 10000;
};

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
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
      value={balancePercentage(balance)}
    />
  );
};

export default BalancePercentage;
