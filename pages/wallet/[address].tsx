import { useRouter } from 'next/router';
import { getValueOrFirstValueFromRouterQueryParam } from '../../utils/router';
import Wallet from '../../components/Wallet/Wallet';

const WalletPage = () => {
  const { query } = useRouter();
  return (
    <Wallet address={getValueOrFirstValueFromRouterQueryParam(query.address)} />
  );
};

export default WalletPage;
