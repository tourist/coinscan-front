import Box from '@mui/material/Box';

import ChainScannerLink from './ChainScannerLink';
import CopyToClipboard from './CopyToClipboard';
import Hash from './Hash';
import settings from '../settings.json';

type TransactionHashProps = { txn: string; short?: boolean };

const TransactionHash = ({ txn, short }: TransactionHashProps) => {
  const link = `${settings.scannerTxnLink}${txn}`;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        a: { display: 'flex' },
      }}
    >
      <Hash short={short} text={txn} />
      <CopyToClipboard text={txn} />
      <Box sx={{ ml: 1 }} />
      <ChainScannerLink title={link} link={link} />
    </Box>
  );
};

export default TransactionHash;
