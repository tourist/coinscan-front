import { useRouter } from 'next/router';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '../Link';

const Navigation = () => {
  const route = useRouter();
  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      <Button
        component={Link}
        href="/"
        variant={
          route.pathname === '/' || route.pathname.includes('/wallet')
            ? 'outlined'
            : 'text'
        }
      >
        Wallets
      </Button>

      <Button
        component={Link}
        href="/transactions"
        variant={route.pathname.includes('/transactions') ? 'outlined' : 'text'}
      >
        Transactions
      </Button>
    </Stack>
  );
};
export default Navigation;
