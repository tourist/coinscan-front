import Typography from '@mui/material/Typography';

type HashProps = {
  text: string;
  short?: boolean;
};
const Hash = ({ text, short }: HashProps) => (
  <Typography
    title={text}
    sx={{
      textOverflow: short ? 'ellipsis' : null,
      overflow: 'hidden',
      maxWidth: short ? '220px' : null,
      marginRight: 1,
    }}
    variant="body2"
  >
    {text}
  </Typography>
);

export default Hash;
