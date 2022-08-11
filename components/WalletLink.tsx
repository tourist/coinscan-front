import Link from './Link';
import Address from './Address';
import Box from '@mui/material/Box';
import CopyToClipboard from './CopyToClipboard';

type WalletLinkProps = {
  walletToLink: string;
  currentWallet?: string;
  short?: boolean;
};

const WalletLink = ({
  currentWallet,
  walletToLink,
  short = false,
}: WalletLinkProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
      <CopyToClipboard text={walletToLink} />
    </Box>
  );
};

export default WalletLink;
