import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DEFAULT_TOOLTIP_TEXT = 'copy to clipboard';
const COPIED_TOOLTIP_TEXT = 'copied';

const CopyToClipboard = ({ text }: { text: string }) => {
  const [title, setTitle] = useState(DEFAULT_TOOLTIP_TEXT);
  const copyToClipboard = () => {
    setTitle(COPIED_TOOLTIP_TEXT);
    navigator.clipboard.writeText(text);
  };
  return (
    <Tooltip
      title={title}
      onClose={() => setTimeout(() => setTitle(DEFAULT_TOOLTIP_TEXT), 250)}
    >
      <ContentCopyIcon
        onClick={copyToClipboard}
        sx={{ cursor: 'pointer', fontSize: '16px', color: '#cccccc' }}
      />
    </Tooltip>
  );
};

export default CopyToClipboard;
