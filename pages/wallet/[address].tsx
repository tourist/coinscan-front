import { GetWalletDetailsQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import { Loading } from '../../components/Wallets/Wallets.styled';
import WalletTransactions from '../../components/Wallets/WalletTransactions';
import {
  useNotifications,
  NOTIFICATION_TYPES,
} from '../../components/Notification';

const GET_WALLET_DETAILS = gql`
  query GetWalletDetails($address: ID!) {
    wallet(id: $address) {
      id
      address
      value
    }
  }
`;

const Wallet = () => {
  const { addNotification } = useNotifications();
  const { query } = useRouter();

  const { loading, error, data } = useQuery<GetWalletDetailsQuery>(
    GET_WALLET_DETAILS,
    {
      variables: {
        address: query.address,
      },
    }
  );

  try {
    query.address &&
      !utils.getAddress(
        Array.isArray(query.address) ? query.address[0] : query.address
      );
  } catch (error) {
    addNotification('Invalid wallet address in URL', NOTIFICATION_TYPES.ERROR);
  }

  return (
    <div>
      {loading && !data ? (
        <Loading>Loading...</Loading>
      ) : (
        <div>
          <h1>Wallett {query && query.address}</h1>
          {data && data.wallet ? (
            <div>Balance: {utils.formatUnits(data.wallet.value, 8)}</div>
          ) : null}
          <WalletTransactions address={query.address?.toString()} />
        </div>
      )}
    </div>
  );
};

export default Wallet;
