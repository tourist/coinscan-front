import settings from '../settings.json';
import { BigNumberish, utils } from 'ethers';

export const formatValue = (value: BigNumberish): string => {
  const stringNumber = utils
    .formatUnits(value, settings.decimalPlaces)
    .split('.');

  return `${parseInt(stringNumber[0], 10).toLocaleString('en-US')}.${
    stringNumber[1]
  }`;
};
