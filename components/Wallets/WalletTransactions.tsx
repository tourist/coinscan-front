import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import { GetWalletTransactionsQuery } from '../../generated/graphql';

import { fromUnixTime, toLocaleStringUTC } from '../HoldersChart/utils';
import Address from '../Address';
import MaterialRemoteTable from '../MaterialRemoteTable';
import WalletLink from '../WalletLink';
import { formatValue } from '../../utils/formatters';

const GET_WALLET_TRANSACTIONS = gql`
  query GetWalletTransactions($address: ID!) {
    wallet(id: $address) {
      id
      address
      value
      transactionsTo {
        id
        txn
        timestamp
        from {
          id
          address
        }
        to {
          id
          address
        }
        value
      }
      transactionsFrom {
        id
        txn
        timestamp
        from {
          id
          address
        }
        to {
          id
          address
        }
        value
      }
    }
  }
`;

type WalletTransactionsProps = {
  address?: string;
};

const Wallet = ({ address }: WalletTransactionsProps) => {
  const { data, error, loading } = useQuery<GetWalletTransactionsQuery>(
    GET_WALLET_TRANSACTIONS,
    {
      variables: {
        address: address,
      },
    }
  );

  type Wallet = NonNullable<GetWalletTransactionsQuery['wallet']>;
  type Transaction =
    | Wallet['transactionsTo'][0]
    | Wallet['transactionsFrom'][0];

  let processedData: Transaction[] = useMemo(
    () =>
      data?.wallet
        ? [...data.wallet.transactionsTo, ...data.wallet.transactionsFrom].sort(
            (a, b) => b.timestamp - a.timestamp
          )
        : [],
    [data]
  );

  const columnHelper = createColumnHelper<Transaction>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: 'Date',
        cell: (info) => toLocaleStringUTC(fromUnixTime(info.getValue())),
      }),
      columnHelper.accessor('txn', {
        header: 'Txn',
        cell: (info) => <Address short address={info.getValue()} />,
      }),
      columnHelper.accessor('from', {
        header: 'From',
        cell: (info) => (
          <WalletLink
            short
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('to', {
        header: 'To',
        cell: (info) => (
          <WalletLink
            short
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => formatValue(info.getValue()),
      }),
    ],
    [columnHelper, address]
  );

  return (
    <div>
      <h2>Wallet Transactions</h2>
      <MaterialRemoteTable
        data={processedData || []}
        loading={loading}
        columns={defaultColumns}
        globalFilterHidden
      />
    </div>
  );
};

export default Wallet;
