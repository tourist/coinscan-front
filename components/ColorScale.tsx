import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { select as d3_select } from 'd3';

function renderColorScale(
  selector: string,
  data: number | number[],
  userOptions?: {}
) {
  let negativePercentText: number | undefined;
  let positivePercentText: number | undefined;
  let negativePercent: number | undefined;
  let positivePercent: number | undefined;

  const defaultOptions = {
    textMargin: 2,
    textMarginSwitchThreshold: 45,
  };

  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  if (Array.isArray(data)) {
    if (data.length === 2) {
      negativePercentText = data[0];
      negativePercent = Math.max(data[0], -100);
      positivePercentText = data[1];
      positivePercent = Math.min(data[1], 100);
    } else {
      console.error(
        `Wrong data array length. Expected 2 elements. Passed: ${data.length}`
      );
      return;
    }
  } else {
    if (data === 0) {
      console.warn(
        "0 passed as data value, should be handled outside as special case as it's not presentable."
      );
      return;
    } else if (data < 0) {
      negativePercentText = data;
      negativePercent = Math.max(-100, data);
    } else {
      positivePercentText = data;
      positivePercent = Math.min(data, 100);
    }
  }

  let negativeTextMargin = options.textMargin;
  let positiveTextMargin = -options.textMargin;
  let negativeTextAnchor = 'start';
  let positiveTextAnchor = 'end';

  if (negativePercent && negativePercent > -options.textMarginSwitchThreshold) {
    negativeTextAnchor = 'end';
    negativeTextMargin = -negativeTextMargin;
  }

  if (positivePercent && positivePercent < options.textMarginSwitchThreshold) {
    positiveTextAnchor = 'start';
    positiveTextMargin = options.textMargin;
  }

  const negativePercentDisplay =
    negativePercent && Math.abs(negativePercent / 2);
  const positivePercentDisplay = positivePercent && positivePercent / 2;

  // clear existing renders
  d3_select(selector).selectAll('svg').remove();

  const svg = d3_select(selector)
    .append('svg')
    .attr('viewBox', '0 0 150 20')
    .attr('background', 'black')
    .attr('preserveAspectRatio', 'xMidYMid');

  const defs = svg.append('defs');

  const sanitizedSelector = selector.replace('#', '');

  if (negativePercentDisplay) {
    defs
      .append('clipPath')
      .attr('id', `negative-clip-${sanitizedSelector}`)
      .append('rect')
      .attr('x', `${50 - negativePercentDisplay}%`)
      .attr('y', 0)
      .attr('width', `${negativePercentDisplay}%`)
      .attr('height', '100%');
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', '50%')
      .attr('height', '100%')
      .attr('fill', `url(#negative-gradient-${sanitizedSelector})`)
      .attr('clip-path', `url(#negative-clip-${sanitizedSelector})`);

    const gradientNegative = defs
      .append('linearGradient')
      .attr('id', 'negative-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%')
      .attr('id', `negative-gradient-${sanitizedSelector}`);

    gradientNegative
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '0%')
      .attr('stop-color', 'red')
      .attr('stop-opacity', 1);

    gradientNegative
      .append('stop')
      .attr('class', 'end')
      .attr('offset', '100%')
      .attr('stop-color', '#ff7377')
      .attr('stop-opacity', 1);
    svg
      .append('text')
      .text(
        `${
          negativePercentText ? parseFloat(negativePercentText.toFixed(2)) : '-'
        }%`
      )
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', negativeTextAnchor)
      .attr('x', `${50 - negativePercentDisplay + negativeTextMargin}%`)
      .attr('y', '50%')
      .attr('font-size', '0.7rem')
      .attr('font-weight', '700')
      .attr('fill', '#ffffff');
  }

  if (positivePercentDisplay) {
    defs
      .append('clipPath')
      .attr('id', `positive-clip-${sanitizedSelector}`)
      .append('rect')
      .attr('x', `50%`)
      .attr('y', 0)
      .attr('width', `${positivePercentDisplay}%`)
      .attr('height', '100%');

    svg
      .append('rect')
      .attr('x', '50%')
      .attr('y', 0)
      .attr('width', '50%')
      .attr('height', '100%')
      .attr('fill', `url(#positive-gradient-${sanitizedSelector})`)
      .attr('clip-path', `url(#positive-clip-${sanitizedSelector})`);

    const gradientPositive = defs
      .append('linearGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%')
      .attr('id', `positive-gradient-${sanitizedSelector}`);
    gradientPositive
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '0%')
      .attr('stop-color', '#77dd77')
      .attr('stop-opacity', 1);
    gradientPositive
      .append('stop')
      .attr('class', 'end')
      .attr('offset', '100%')
      .attr('stop-color', '#09b051')
      .attr('stop-opacity', 1);

    svg
      .append('text')
      .text(
        `+${
          positivePercentText ? parseFloat(positivePercentText.toFixed(2)) : '-'
        }%`
      )
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', positiveTextAnchor)
      .attr('x', `${50 + positivePercentDisplay + positiveTextMargin}%`)
      .attr('y', '50%')
      .attr('font-size', '0.7rem')
      .attr('font-weight', '700')
      .attr('fill', '#ffffff');
  }
}

type ColorScaleProps = {
  id: number | string;
  data: number | number[];
};

const ColorScale = ({ id, data }: ColorScaleProps) => {
  useEffect(() => renderColorScale(`#color-box${id}`, data), [id, data]);
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
      id={`color-box${id}`}
    ></Box>
  );
};

export default ColorScale;
