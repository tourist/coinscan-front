import settings from '../settings.json';
import { utils } from 'ethers';

export const formatValue = (value: bigint | number | string): string => {
  let stringNumber: string[] = [];

  if (typeof value === 'number') {
    stringNumber = [BigInt(value).toString()];
  }

  if (typeof value === 'bigint' || typeof value === 'string') {
    stringNumber = utils
      .formatUnits(value.toString(), settings.decimalPlaces)
      .split('.');
  }

  return `${parseInt(stringNumber[0], 10).toLocaleString('en-US')}.${
    stringNumber[1] || '0'
  }`;
};
