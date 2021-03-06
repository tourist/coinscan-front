import { utils, BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';

const balancePercentage = (value: string) => {
  // make balance larger as BigNumber doesn't support fractions
  const balance = BigNumber.from(value).mul(BigNumber.from(1000000));
  const totalSupply = utils.parseUnits(
    process.env.NEXT_PUBLIC_TOTAL_SUPPLY!,
    8
  );
  const percent = balance.div(totalSupply);
  // 4-digit precision
  return percent.toNumber() / 10000;
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
