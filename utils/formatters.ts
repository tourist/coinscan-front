import settings from '../settings.json';
import { utils } from 'ethers';

export const formatValue = (value: bigint | number | string): string => {
  let valueArray: string[] = [];

  if (typeof value === 'number') {
    valueArray = [BigInt(value).toString()];
  }

  if (typeof value === 'bigint' || typeof value === 'string') {
    valueArray = utils
      .formatUnits(value.toString(), settings.decimalPlaces)
      .split('.');
  }

  return `${parseInt(valueArray[0], 10).toLocaleString('en-US')}.${
    valueArray[1] || '0'
  }`;
};
