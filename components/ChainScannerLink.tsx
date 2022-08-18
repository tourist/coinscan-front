import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from './Link';

const ChainScannerLink = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link href={link} title={title} target="_blank" rel="noopener noreferrer">
      <OpenInNewIcon
        sx={{ cursor: 'pointer', fontSize: '16px', color: '#cccccc' }}
      />
    </Link>
  );
};

export default ChainScannerLink;
