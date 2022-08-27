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
  value?: number;
  text?: string;
  loading?: boolean;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    {loading ? (
      <Skeleton width={150} />
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
          {value?.toFixed(2)}%
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
        sx={{ color: 'text.primary', fontSize: '3rem', fontWeight: 'medium' }}
      >
        {loading ? (
          <Skeleton width={150} height={70} />
        ) : (
          value && value.toLocaleString('en-US')
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <GrowthPercent loading={loading} value={oneday} text="vs. last day" />
        <GrowthPercent
          loading={loading}
          value={sevendays}
          text="vs. last 7 days"
        />
        <GrowthPercent
          loading={loading}
          value={thirtydays}
          text="vs. last 30 day"
        />
      </Box>
    </Box>
  );
};

export default Growth;
