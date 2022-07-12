import type { NextPage } from 'next';
import TotalHodlers from '../components/HoldersChart/TotalHodlers';
import HodlersChartGroupings from '../components/HoldersChart/HodlersChart';
import Wallets from '../components/Wallets/Wallets';

const Home: NextPage = () => {
  return (
    <div>
      <TotalHodlers />
      <HodlersChartGroupings />
      <Wallets />
    </div>
  );
};

export default Home;
