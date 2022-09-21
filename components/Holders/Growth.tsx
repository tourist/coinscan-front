import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

type GrowthProps = {
  value?: number;
  oneday?: number;
  sevendays?: number;
  thirtydays?: number;
  loading?: boolean;
};

export const GrowthPercent = ({
  value,
  text,
  loading,
}: {
  value: number | undefined;
  text: string | undefined;
  loading: boolean | undefined;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', mr: 2 }}>
    {loading ? (
      <Skeleton sx={{ width: { xs: 80, sm: 150 } }} />
    ) : (
      <>
        <Box
          sx={{
            color:
              value && value < 0
                ? 'error.dark'
                : value && value > 0
                ? 'success.dark'
                : 'text.primary',
            display: 'inline',
            fontWeight: 'bold',
            mx: 0.5,
            fontSize: 14,
          }}
        >
          {value && value > 0 ? '+' : null}
          {value ? parseFloat(value.toFixed(2)) : '0'}%
        </Box>
        <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
          {text}
        </Box>
      </>
    )}
  </Box>
);

const Growth = ({
  value,
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
          value && value.toLocaleString('en-US')
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
