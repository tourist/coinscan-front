import Link from '../Link';
import Address from './Address';

type WalletLinkProps = {
  currentWallet?: string;
  walletToLink?: string;
  short?: boolean;
};

const WalletLink = ({
  currentWallet,
  walletToLink,
  short = false,
}: WalletLinkProps) => {
  return (
    <>
      {currentWallet === walletToLink ? (
        <Address short={short} address={walletToLink} />
      ) : (
        <Link
          href={{
            pathname: '/wallet/[address]',
            query: { address: walletToLink },
          }}
        >
          <Address short={short} address={walletToLink} />
        </Link>
      )}
    </>
  );
};

export default WalletLink;
