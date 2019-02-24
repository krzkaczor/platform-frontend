import BigNumber from "bignumber.js";

/**
 * Formats number to desired decimals and precision.
 * IMPORTANT: Use only for display in UI, not for token calculations in business logic!
 */
export function formatMoney(
  value: BigNumber,
  currencyDecimals: number,
  decimalPlaces?: number,
): string {
  const moneyInPrimaryBase = value.div(new BigNumber(10).pow(currencyDecimals));
  return decimalPlaces !== undefined
    ? moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_UP)
    : moneyInPrimaryBase.toString();
}
