import { useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  extent as d3_extent,
  select as d3_select,
  scaleLinear as d3_scaleLinear,
  scaleBand as d3_scaleBand,
} from 'd3';
import type { DataPoint } from '../utils/charts';

function renderSparkBar(
  selector: string,
  data: DataPoint<bigint | number>[],
  colors: [positiveColor: string, negativeColor: string] = ['green', 'tomato']
) {
  const DATA_EXTENT = d3_extent(data, (d) => Number(d.count));

  if (DATA_EXTENT[0] === undefined || DATA_EXTENT[1] === undefined) {
    return;
  }

  const WIDTH = 200;
  const HEIGHT = 50;
  const DATA_MAX = DATA_EXTENT[1];
  const DATA_MIN = DATA_EXTENT[0];
  const SIDE_MAX = Math.max(Math.abs(DATA_MIN), Math.abs(DATA_MAX));

  const x = d3_scaleBand()
    .domain(data.map((d) => d.id))
    .range([0, WIDTH])
    .paddingInner(0.5)
    .paddingOuter(0.5);
  const y = d3_scaleLinear().domain([-SIDE_MAX, SIDE_MAX]).range([HEIGHT, 0]);

  // clear existing renders
  d3_select(selector).selectAll('svg').remove();

  const svg = d3_select(selector)
    .append('svg')
    .attr('viewBox', '0 0 200 50')
    .attr('preserveAspectRatio', 'xMidYMid');

  svg
    .append('line')
    .attr('x1', 0)
    .attr('y1', y(0))
    .attr('x2', WIDTH)
    .attr('y2', y(0))
    .attr('stroke', 'white')
    .attr('stroke-opacity', 0.1)
    .attr('shape-rendering', 'crispEdges');

  svg.append('g');
  svg
    .selectAll('.bar')
    .data(data.filter((i) => i.count != BigInt(0)))
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.id) || null)
    .attr('y', (d) => (d.count > 0 ? y(Number(d.count)) - 1 : y(0) + 1))
    .attr('width', x.bandwidth)
    .attr('height', (d) => Math.abs(y(Number(d.count)) - y(0)))
    .attr('fill', (d) => (d.count > 0 ? colors[0] : colors[1]));
}

type SparkBarProps = {
  id: number | string;
  data: DataPoint<bigint | number>[];
};

const SparkBar = ({ id, data }: SparkBarProps) => {
  useEffect(() => renderSparkBar(`#spark-bar${id}`, data), [id, data]);
  if (data.length === 0) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        svg: {
          width: '100%',
          height: '40px',
        },
      }}
      id={`spark-bar${id}`}
    ></Box>
  );
};

export default SparkBar;
