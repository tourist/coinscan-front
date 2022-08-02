import Typography from '@mui/material/Typography';
import Link from '../Link';

type WalletLinkProps = {
  currentWallet?: string;
  walletToLink?: string;
};

const WalletLink = ({ currentWallet, walletToLink }: WalletLinkProps) => {
  return (
    <>
      {currentWallet === walletToLink ? (
        <Typography variant="body2">{walletToLink}</Typography>
      ) : (
        <Link
          href={{
            pathname: '/wallet/[address]',
            query: { address: walletToLink },
          }}
        >
          {walletToLink}
        </Link>
      )}
    </>
  );
};

export default WalletLink;
