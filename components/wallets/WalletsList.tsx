import { GetWalletsPaginatedQuery } from '../../generated/graphql';
import { utils } from 'ethers';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
} from '@mui/material';
import Link from '../Link';
import BalancePercentage from './BalancePercentage';

type WalletsListProps = {
  wallets?: GetWalletsPaginatedQuery['wallets'];
  page?: number;
  perPage?: number;
};

const WalletsList = ({ wallets, page, perPage }: WalletsListProps) => {
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
                <BalancePercentage balance={wallet.value} />
              </TableCell>
              <TableCell>{utils.formatUnits(wallet.value, 8)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default WalletsList;
