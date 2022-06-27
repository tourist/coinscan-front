import { Wallet } from '../../generated/graphql';
import { utils } from 'ethers';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

type WalletsListProps = {
  wallets: Wallet[] | undefined;
  page: number;
  perPage: number;
};

const WalletsList = ({ wallets, page, perPage }: WalletsListProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Rank</TableCell>
          <TableCell>Wallet</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {wallets &&
          wallets.map((wallet, index) => (
            <TableRow key={wallet.id}>
              <TableCell>{perPage * (page - 1) + index + 1}</TableCell>
              <TableCell>{wallet.address}</TableCell>
              <TableCell>{utils.formatUnits(wallet.value, 8)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default WalletsList;
