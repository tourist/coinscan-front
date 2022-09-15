import Head from 'next/head';

import Transactions from '../../components/Transactions/Transactions';
import settings from '../../settings.json';

const TransactionsPage = () => {
  return (
    <>
      <Head>
        <title>
          {`${settings.tokenTicker} - ${settings.tokenName} hot transactions - ${settings.globalHtmlTitleSuffix}`}
        </title>
      </Head>
      <Transactions hot />
    </>
  );
};

export default TransactionsPage;
