import { GetWalletsPaginatedQuery } from '../../generated/graphql';
import { utils, BigNumber } from 'ethers';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
} from '@mui/material';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Link from '../Link';

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

type WalletsListProps = {
  wallets?: GetWalletsPaginatedQuery['wallets'];
  page?: number;
  perPage?: number;
};

const WalletsList = ({ wallets, page, perPage }: WalletsListProps) => {
  const balancePercentage = (value: number) => {
    const balance = BigNumber.from(value).mul(BigNumber.from(10000));
    const totalSupply = utils.parseUnits(
      process.env.NEXT_PUBLIC_TOTAL_SUPPLY!,
      8
    );
    const percent = balance.div(totalSupply);
    return percent.toNumber() / 100;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Rank</TableCell>
          <TableCell>Wallet</TableCell>
          <TableCell>Percent of supply</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {wallets &&
          wallets.map((wallet, index) => (
            <TableRow key={wallet.id}>
              <TableCell>
                {page && perPage ? perPage * (page - 1) + index + 1 : index}
              </TableCell>
              <TableCell>
                <Link
                  href={{
                    pathname: '/wallet/[address]',
                    query: { address: wallet.address },
                  }}
                  passHref
                >
                  {wallet.address}
                </Link>
              </TableCell>
              <TableCell>
                <LinearProgressWithLabel
                  variant="determinate"
                  value={balancePercentage(wallet.value)}
                />
              </TableCell>
              <TableCell>{utils.formatUnits(wallet.value, 8)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default WalletsList;
