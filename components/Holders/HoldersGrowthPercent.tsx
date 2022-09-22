import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

type GrowthPercentProps = {
  value: number;
  text: string;
  loading?: boolean;
};

export const GrowthPercent = ({ value, text, loading }: GrowthPercentProps) => (
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

export default GrowthPercent;
