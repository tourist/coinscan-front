import settings from '../settings.json';
import { utils } from 'ethers';

export const formatValue = (value?: bigint): string => {
  if (!value) {
    return '';
  }
  const stringNumber = utils
    .formatUnits(value.toString(), settings.decimalPlaces)
    .split('.');

  return `${parseInt(stringNumber[0], 10).toLocaleString('en-US')}.${
    stringNumber[1]
  }`;
};
