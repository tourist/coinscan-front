import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from './Link';

const ChainScannerLink = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link
      sx={{ display: 'flex' }}
      href={link}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <OpenInNewIcon
        sx={{ cursor: 'pointer', fontSize: '16px', color: 'grey.500' }}
      />
    </Link>
  );
};

export default ChainScannerLink;
