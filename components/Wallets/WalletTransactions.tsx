import { useMemo } from 'react';
import { GetWalletTransactionsQuery } from '../../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import { fromUnixTime, toLocaleStringUTC } from '../HoldersChart/utils';
import { utils } from 'ethers';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Pagination,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import WalletLink from './WalletLink';
import { Loading } from './Wallets.styled';
import { useTanstackTableRoutedPagination } from '../../utils/pagination';

const PER_PAGE_DEFAULT = 10;

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
      }),
      columnHelper.accessor('from', {
        header: 'From',
        cell: (info) => (
          <WalletLink
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('to', {
        header: 'To',
        cell: (info) => (
          <WalletLink
            currentWallet={address}
            walletToLink={info.getValue().id}
          />
        ),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => utils.formatUnits(info.getValue(), 8),
      }),
    ],
    [columnHelper, address]
  );

  const table = useReactTable({
    data: processedData,
    columns: defaultColumns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: PER_PAGE_DEFAULT,
      },
    },
  });

  const { page, changePage } =
    useTanstackTableRoutedPagination<Transaction>(table);

  return (
    <div>
      <h2>Wallet Transactions</h2>

      {error && <div>{error.toString()}</div>}
      {loading && <Loading>Loading...</Loading>}

      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {processedData && processedData.length > PER_PAGE_DEFAULT ? (
        <Pagination
          onChange={changePage}
          page={page}
          count={Math.ceil(processedData.length / PER_PAGE_DEFAULT)}
        />
      ) : null}
    </div>
  );
};

export default Wallet;
