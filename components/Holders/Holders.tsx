import { gql } from '@apollo/client';
import Grid from '@mui/material/Grid';

import TotalHodlers from './TotalHodlers';
import HoldersChartGroupings from './HoldersChart';
import { DailyHoldersStatesQuery } from '../../generated/graphql';

export const GET_DAILY_HOLDERS = gql`
  query DailyHoldersStates {
    dailyHoldersStates(orderBy: id, orderDirection: desc, first: 1000) {
      id
      count
    }
  }
`;

const Holders = ({ data }: { data?: DailyHoldersStatesQuery }) => {
  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <TotalHodlers data={data} />
      </Grid>
      <Grid item xs={12} md={8} sx={{ mt: { xs: 3, sm: 0 } }}>
        <HoldersChartGroupings data={data} />
      </Grid>
    </Grid>
  );
};
export default Holders;
