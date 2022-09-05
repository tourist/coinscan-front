import type { NextPage } from 'next';
import Grid from '@mui/material/Grid';

import Holders from '../components/Holders/Holders';
import Wallets from '../components/Charts/Wallets';

const Home: NextPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Holders />
      </Grid>
      <Grid item xs={12}>
        <Wallets />
      </Grid>
    </Grid>
  );
};

export default Home;
