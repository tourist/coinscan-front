import Link from '../Link';
import Box from '@mui/material/Box';

import Hash from './Hash';
import ChainScannerLink from '../Addresses/ChainScannerLink';
import CopyToClipboard from '../CopyToClipboard';
import settings from '../../settings.json';

type WalletLinkProps = {
  walletToLink: string;
  scannerLink?: boolean;
  currentWallet?: string;
  short?: boolean;
};

const WalletLink = ({
  currentWallet,
  walletToLink,
  scannerLink,
  short = false,
}: WalletLinkProps) => {
  const link = `${settings.scannerAddressLink}${walletToLink}`;
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
        <Hash short={short} text={walletToLink} />
      ) : (
        <Link
          title={walletToLink}
          href={{
            pathname: '/wallet/[address]',
            query: { address: walletToLink },
          }}
        >
          <Hash
            text={
              settings.addresses[walletToLink]
                ? settings.addresses[walletToLink]
                : walletToLink
            }
            title={walletToLink}
            short={short}
          />
        </Link>
      )}
      <CopyToClipboard text={walletToLink} />
      {scannerLink ? (
        <>
          <Box sx={{ ml: 1 }} />
          <ChainScannerLink title={link} link={link} />
        </>
      ) : null}
    </Box>
  );
};

export default WalletLink;
