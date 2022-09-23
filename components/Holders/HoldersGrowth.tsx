import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import GrowthPercent from './HoldersGrowthPercent';

type GrowthProps = {
  holdersCount: number;
  oneday: number;
  sevendays: number;
  thirtydays: number;
  loading?: boolean;
};

const Growth = ({
  holdersCount,
  oneday,
  sevendays,
  thirtydays,
  loading,
}: GrowthProps) => {
  return (
    <Box>
      <Box sx={{ color: 'text.primary' }}>Total Holders</Box>
      <Box
        sx={{
          color: 'text.primary',
          fontSize: '3rem',
          fontWeight: 'medium',
        }}
      >
        {loading ? (
          <Skeleton sx={{ height: 70, width: { xs: 80, sm: 150 } }} />
        ) : (
          holdersCount && holdersCount.toLocaleString('en-US')
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
        }}
      >
        <GrowthPercent loading={loading} value={oneday} text="1d" />
        <GrowthPercent loading={loading} value={sevendays} text="7d" />
        <GrowthPercent loading={loading} value={thirtydays} text="30d" />
      </Box>
    </Box>
  );
};

export default Growth;
