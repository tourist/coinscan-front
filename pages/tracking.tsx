import Head from 'next/head';

import Tracking from '../components/Tracking/Tracking';
import settings from '../settings.json';

const TrackingPage = () => {
  return (
    <>
      <Head>
        <title>
          {`${settings.tokenTicker} - ${settings.tokenName} Tracked wallets - ${settings.globalHtmlTitleSuffix}`}
        </title>
      </Head>
      <Tracking />
    </>
  );
};

export default TrackingPage;
