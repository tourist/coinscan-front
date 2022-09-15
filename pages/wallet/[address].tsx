import { useRouter } from 'next/router';
import Head from 'next/head';
import { getValueOrFirstValueFromRouterQueryParam } from '../../utils/router';
import Wallet from '../../components/Wallet/Wallet';
import settings from '../../settings.json';

const WalletPage = () => {
  const { query } = useRouter();
  const address = getValueOrFirstValueFromRouterQueryParam(query.address);
  const title = settings.addresses[address]
    ? settings.addresses[address]
    : `${query.address} - ${settings.tokenTicker} holdings - ${settings.globalHtmlTitleSuffix}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Wallet address={address} />
    </>
  );
};

export default WalletPage;
