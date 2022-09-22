import Link from '../Link';
import Box from '@mui/material/Box';

import Hash from './Hash';
import ChainScannerLink from '../Addresses/ChainScannerLink';
import CopyToClipboard from '../CopyToClipboard';
import settings from '../../settings.json';

type WalletLinkProps = {
  walletToLink: string;
  currentWallet?: string;
  scannerLink?: boolean;
  short?: boolean;
};

const WalletLink = ({
  currentWallet,
  walletToLink,
  scannerLink,
  short = false,
}: WalletLinkProps) => {
  const chainScannerLink = `${settings.scannerAddressLink}${walletToLink}`;
  const walletLinkText = settings.addresses[walletToLink]
    ? settings.addresses[walletToLink]
    : walletToLink;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        a: { display: 'flex' },
      }}
    >
      {currentWallet === walletToLink ? (
        <Hash short={short} text={walletLinkText} title={walletToLink} />
      ) : (
        <Link
          title={walletToLink}
          href={{
            pathname: '/wallet/[address]',
            query: { address: walletToLink },
          }}
        >
          <Hash text={walletLinkText} title={walletToLink} short={short} />
        </Link>
      )}
      <CopyToClipboard text={walletToLink} />
      {scannerLink ? (
        <>
          <Box sx={{ ml: 1 }} />
          <ChainScannerLink title={chainScannerLink} link={chainScannerLink} />
        </>
      ) : null}
    </Box>
  );
};

export default WalletLink;
