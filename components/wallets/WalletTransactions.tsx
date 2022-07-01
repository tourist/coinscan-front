import { useState } from 'react';
import { GetWalletTransactionsQuery } from '../../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import {
  Pagination,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { Loading } from '../../components/wallets/Wallets.styled';
import Link from '../../components/Link';

const PER_PAGE_DEFAULT = 10;

const GET_WALLET_TRANSACTIONS = gql`
  query GetWalletTransactions($address: String!) {
    transactionsFrom: transactions(where: { from: $address }) {
      id
      txn
      from {
        id
      }
      to {
        id
      }
      value
      timestamp
    }
    transactionsTo: transactions(where: { to: $address }) {
      id
      txn
      from {
        id
      }
      to {
        id
      }
      value
      timestamp
    }
  }
`;

type WalletLinkProps = {
  currentWallet?: string;
  walletToLink?: string;
};

const WalletLink = ({ currentWallet, walletToLink }: WalletLinkProps) => {
  return (
    <>
      {currentWallet === walletToLink ? (
        <Typography variant="body2">{walletToLink}</Typography>
      ) : (
        <Link
          href={{
            pathname: '/wallet/[address]',
            query: { address: walletToLink },
          }}
          passHref
        >
          {walletToLink}
        </Link>
      )}
    </>
  );
};

type WalletTransactionsProps = {
  address?: string;
};

const Wallet = ({ address }: WalletTransactionsProps) => {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useQuery<GetWalletTransactionsQuery>(
    GET_WALLET_TRANSACTIONS,
    {
      variables: {
        address: address,
      },
    }
  );

  let mergedData =
    data && data.transactionsTo && data.transactionsFrom
      ? [...data.transactionsTo, ...data.transactionsFrom]
      : null;

  let pageData: typeof mergedData = mergedData;

  if (mergedData) {
    mergedData.sort((a, b) => b.timestamp - a.timestamp);
    pageData = mergedData.slice(
      (page - 1) * PER_PAGE_DEFAULT,
      page * PER_PAGE_DEFAULT
    );
  }

  return (
    <div>
      <h2>Wallet Transactions</h2>
      {error && <div>{error.toString()}</div>}
      {loading && <Loading>Loading...</Loading>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Txn</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageData &&
            pageData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.timestamp * 1000).toLocaleString()}
                </TableCell>
                <TableCell>{transaction.txn}</TableCell>
                <TableCell>
                  <WalletLink
                    currentWallet={address}
                    walletToLink={transaction.from.id}
                  />
                </TableCell>
                <TableCell>
                  <WalletLink
                    currentWallet={address}
                    walletToLink={transaction.to.id}
                  />
                </TableCell>
                <TableCell>{utils.formatUnits(transaction.value, 8)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {mergedData && mergedData.length > PER_PAGE_DEFAULT ? (
        <Pagination
          onChange={(_, page) => setPage(page)}
          count={Math.ceil(mergedData.length / PER_PAGE_DEFAULT)}
        />
      ) : null}
    </div>
  );
};

export default Wallet;
