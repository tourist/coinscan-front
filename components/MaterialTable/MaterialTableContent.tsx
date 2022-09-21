import { memo } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { RowData, Table as TableType } from '@tanstack/table-core';
import { flexRender } from '@tanstack/react-table';

import MaterialTableRowsSkeleton from './MaterialTableRowsSkeleton';
import type { LocalState } from './MaterialTable';

type MaterialTableContentProps<TData> = {
  state: LocalState<TData>;
  table: TableType<TData>;
  tableSize: 'medium' | 'small';
};

const MaterialTableContent = <TData extends RowData>({
  state,
  table,
  tableSize,
}: MaterialTableContentProps<TData>) => {
  return (
    <>
      <TableContainer>
        <Table size={tableSize}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    {...header.getContext().column.columnDef.meta}
                  >
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
            {state.loading && state.data.length === 0 ? (
              <MaterialTableRowsSkeleton
                columns={table.getAllColumns().length}
              />
            ) : null}
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    {...cell.getContext().column.columnDef.meta}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {table.getRowModel().rows.length === 0 ? (
        <Typography sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          No results
        </Typography>
      ) : null}
    </>
  );
};

export default memo(MaterialTableContent) as typeof MaterialTableContent;
