import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import random from 'lodash/random';

type MaterialTableRowsSkeletonProps = { columns: number };

const MaterialTableRowsSkeleton = ({
  columns,
}: MaterialTableRowsSkeletonProps) => (
  <>
    {Array(10)
      .fill(null)
      .map((_, rowIdx: number) => (
        <TableRow key={rowIdx}>
          {Array(columns)
            .fill(null)
            .map((_, colIdx: number) => (
              <TableCell key={colIdx}>
                <Skeleton
                  style={{
                    maxWidth:
                      process.env.NODE_ENV === 'test'
                        ? undefined
                        : random(100, 350),
                  }}
                />
              </TableCell>
            ))}
        </TableRow>
      ))}
  </>
);

export default MaterialTableRowsSkeleton;
