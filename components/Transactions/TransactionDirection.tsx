import Chip from '@mui/material/Chip';

const TransactionDirection = ({ incoming }: { incoming?: boolean }) => {
  const color = incoming ? 'success.light' : 'error.light';
  const label = incoming ? 'IN' : 'OUT';
  return (
    <Chip
      sx={{
        width: 60,
        backgroundColor: color,
        borderRadius: 2,
      }}
      label={label}
    />
  );
};

export default TransactionDirection;
