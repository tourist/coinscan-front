import { useRouter } from 'next/router';
import { SxProps, Theme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '../Link';

const Navigation = ({ sx = [] }: { sx?: SxProps<Theme> }) => {
  const route = useRouter();
  return (
    <Stack
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      <Button
        component={Link}
        href="/"
        variant={
          route.pathname === '/' || route.pathname.includes('/wallet')
            ? 'contained'
            : 'outlined'
        }
      >
        Wallets
      </Button>

      <Button
        component={Link}
        href="/transactions"
        variant={
          route.pathname.includes('/transactions') ? 'contained' : 'outlined'
        }
      >
        Transactions
      </Button>
    </Stack>
  );
};
export default Navigation;
