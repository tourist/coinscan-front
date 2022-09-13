import settings from '../settings.json';
import { utils } from 'ethers';
/**
 * Returns readable notation of big numbers
 *
 * @param value value to be formatted
 * @param intlNumberFormatOptions Intl.NumberFormatOptions to be passed to integer part of formatted value e.g. `{notation: 'compact'}`
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
 * @returns formatted value e.g. 100000000000123 > 10,0000.00000123
 */
export const formatValue = (
  value: bigint | number | string,
  intlNumberFormatOptions: Intl.NumberFormatOptions = { notation: 'standard' }
): string => {
  let valueArray: string[] = [];

  if (typeof value === 'number') {
    valueArray = [BigInt(value).toString()];
  }

  if (typeof value === 'bigint' || typeof value === 'string') {
    valueArray = utils
      .formatUnits(value.toString(), settings.decimalPlaces)
      .split('.');
  }
  return `${new Intl.NumberFormat('en-US', intlNumberFormatOptions).format(
    parseInt(valueArray[0], 10)
  )}.${valueArray[1] || '0'}`;
};
