import { gql, useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';

import TotalHodlers from './TotalHodlers';
import HodlersChartGroupings from './HodlersChart';
import { DailyHodlersStatesQuery } from '../../generated/graphql';

const GET_DAILY_HOLDERS = gql`
  query DailyHodlersStates {
    dailyHoldersStates(orderBy: id, orderDirection: desc, first: 1000) {
      id
      count
    }
  }
`;

const Holders = () => {
  const { loading, data } =
    useQuery<DailyHodlersStatesQuery>(GET_DAILY_HOLDERS);

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <TotalHodlers loading={loading} data={data} />
      </Grid>
      <Grid item xs={12} md={8}>
        <HodlersChartGroupings loading={loading} data={data} />
      </Grid>
    </Grid>
  );
};
export default Holders;
