import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const TransactionHottnessHeader = () => (
  <Tooltip title="Hottness shows if transaction is significant among other transactions.">
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      Hottness <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: '1.25rem' }} />
    </Box>
  </Tooltip>
);

export default TransactionHottnessHeader;
