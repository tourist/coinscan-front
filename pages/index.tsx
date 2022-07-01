import type { NextPage } from 'next';
import TotalHodlers from '../components/hodlers/TotalHodlers';
import HodlersChart from '../components/hodlers/HodlersChart';
import Wallets from '../components/wallets/Wallets';

const Home: NextPage = () => {
  return (
    <div>
      <TotalHodlers />
      <HodlersChart />
      <Wallets />
    </div>
  );
};

export default Home;
