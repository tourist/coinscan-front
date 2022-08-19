import Typography from '@mui/material/Typography';

type HashProps = {
  text: string;
  short?: boolean;
  title?: string;
};
const Hash = ({ text, title, short }: HashProps) => (
  <Typography
    title={title || text}
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
