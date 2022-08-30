import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

const DEFAULT_TOOLTIP_TEXT = 'copy to clipboard';
const COPIED_TOOLTIP_TEXT = 'copied';

const CopyToClipboard = ({ text }: { text: string }) => {
  const [title, setTitle] = useState(DEFAULT_TOOLTIP_TEXT);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setTitle(COPIED_TOOLTIP_TEXT);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
      setTitle(DEFAULT_TOOLTIP_TEXT);
    }, 2000);
  };

  const IconComponent = copied ? DoneIcon : ContentCopyIcon;
  return (
    <Tooltip
      title={title}
      onClose={() => {
        setTimeout(() => setTitle(DEFAULT_TOOLTIP_TEXT), 250);
      }}
    >
      <IconComponent
        onClick={copyToClipboard}
        sx={{
          cursor: 'pointer',
          fontSize: '16px',
          color: copied ? 'success.main' : 'grey.500',
        }}
      />
    </Tooltip>
  );
};

export default CopyToClipboard;
