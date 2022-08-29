import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import dayjs from 'dayjs';

import type { GetWalletTransactionsQuery } from '../../generated/graphql';
import { formatValue } from '../../utils/formatters';
import { getUnixTime } from '../../utils/charts';
import { GrowthPercent } from '../Growth';
import settings from '../../settings.json';
import CopyToClipboard from '../CopyToClipboard';
import ChainScannerLink from '../ChainScannerLink';
import { getNetFlowPercentageFromWallet } from '../Wallets/utils';

type WalletDetailsProps = {
  address: string;
  data?: GetWalletTransactionsQuery;
  loading?: boolean;
};

const WalletDetails = ({ address, data, loading }: WalletDetailsProps) => {
  const oneDayAgoTimestamp = getUnixTime(dayjs().subtract(1, 'days').toDate());
  const sevenDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(7, 'days').toDate()
  );
  const thirtyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(30, 'days').toDate()
  );
  const ninetyDaysAgoTimestamp = getUnixTime(
    dayjs().subtract(90, 'days').toDate()
  );

  const oneDayGrowth = getNetFlowPercentageFromWallet(
    data?.wallet,
    oneDayAgoTimestamp
  );

  const sevenDayGrowth = getNetFlowPercentageFromWallet(
    data?.wallet,
    sevenDaysAgoTimestamp
  );

  const thirtyDayGrowth = getNetFlowPercentageFromWallet(
    data?.wallet,
    thirtyDaysAgoTimestamp
  );
  const ninetyDayGrowth = getNetFlowPercentageFromWallet(
    data?.wallet,
    ninetyDaysAgoTimestamp
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ mr: 1.5, fontSize: { xs: '0.85rem', sm: '1.1rem' } }}>
          {!address ? <Skeleton width={300} /> : address}
        </Typography>
        <CopyToClipboard text={address} />
        <Box sx={{ ml: 1.5 }}>
          <ChainScannerLink
            title={address}
            link={`${settings.scannerAddressLink}${address}`}
          />
        </Box>
      </Box>
      {settings.addresses[address] ? (
        <Typography sx={{ mt: 1 }}>
          Recognized owner:{' '}
          <Typography
            component="span"
            sx={{
              fontWeight: 'fontWeightBold',
            }}
          >
            {settings.addresses[address]}
          </Typography>
        </Typography>
      ) : null}
      <Box
        sx={{
          my: 2,
        }}
      >
        <Typography>
          Balance:{' '}
          {loading ? (
            <Skeleton
              sx={{ display: 'inline-block' }}
              height={25}
              width={150}
            />
          ) : (
            <Typography
              component="span"
              sx={{
                fontWeight: 'fontWeightBold',
              }}
            >
              {formatValue(data?.wallet?.value)}
            </Typography>
          )}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <>
          <GrowthPercent loading={loading} value={oneDayGrowth} text="1d" />
          <GrowthPercent loading={loading} value={sevenDayGrowth} text="7d" />
          <GrowthPercent loading={loading} value={thirtyDayGrowth} text="30d" />
          <GrowthPercent loading={loading} value={ninetyDayGrowth} text="90d" />
        </>
      </Box>
    </>
  );
};

export default WalletDetails;
