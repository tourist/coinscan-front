import Box from '@mui/material/Box';

type GrowthProps = {
  value?: number;
  oneday?: number;
  sevendays?: number;
  thirtydays?: number;
};

const GrowthPercent = ({ value, text }: { value?: number; text?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
  </Box>
);

const Growth = ({ value, oneday, sevendays, thirtydays }: GrowthProps) => {
  return (
    <Box>
      <Box sx={{ color: 'text.primary' }}>Total Holders</Box>
      <Box
        sx={{ color: 'text.primary', fontSize: '3rem', fontWeight: 'medium' }}
      >
        {value && value.toLocaleString('en-US')}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <GrowthPercent value={oneday} text="vs. last day" />
        <GrowthPercent value={sevendays} text="vs. last 7 days" />
        <GrowthPercent value={thirtydays} text="vs. last 30 day" />
      </Box>
    </Box>
  );
};

export default Growth;
