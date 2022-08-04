import type { NextPage } from 'next';
import Grid from '@mui/material/Grid';
import TotalHodlers from '../components/HoldersChart/TotalHodlers';
import HodlersChartGroupings from '../components/HoldersChart/HodlersChart';
import Wallets from '../components/Wallets/Wallets';

const Home: NextPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TotalHodlers />
      </Grid>
      <Grid item xs={12} md={8}>
        <HodlersChartGroupings />
      </Grid>
      <Grid item xs={12}>
        <Wallets />
      </Grid>
    </Grid>
  );
};

export default Home;
