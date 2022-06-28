import { GetWalletDetailsQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import { Loading } from '../../components/wallets/Wallets.styled';
import WalletTransactions from '../../components/wallets/WalletTransactions';

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
  const { query } = useRouter();

  const { loading, error, data } = useQuery<GetWalletDetailsQuery>(
    GET_WALLET_DETAILS,
    {
      variables: {
        address: query.address,
      },
    }
  );

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
