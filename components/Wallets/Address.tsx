import Typography from '@mui/material/Typography';

type AddressProps = { address?: string; short?: boolean };

const Address = ({ address, short }: AddressProps) => (
  <Typography
    title={address}
    sx={{
      textOverflow: short ? 'ellipsis' : null,
      overflow: 'hidden',
      maxWidth: short ? '220px' : null,
    }}
    variant="body2"
  >
    {address}
  </Typography>
);

export default Address;
