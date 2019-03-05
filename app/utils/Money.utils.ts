import BigNumber from "bignumber.js";

export enum ERoundingMode {
  UP = "up",
  DOWN = "down",
  HALF_UP = "half_up",
  HALF_DOWN = "half_down",
}

export function formatToFixed(
  moneyInPrimaryBase: BigNumber,
  decimalPlaces: number,
  roundingMode?: ERoundingMode,
): string {
  switch (roundingMode) {
    case ERoundingMode.DOWN:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_DOWN);
    case ERoundingMode.HALF_DOWN:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_HALF_DOWN);
    case ERoundingMode.HALF_UP:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_HALF_UP);
    case ERoundingMode.UP:
    default:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_UP);
  }
}

/**
 * Formats number to desired decimals and precision.
 * IMPORTANT: Use only for display in UI, not for token calculations in business logic!
 */
export function formatMoney(
  value: string | BigNumber | number,
  currencyDecimals: number,
  decimalPlaces?: number,
  roundingMode?: ERoundingMode,
): string {
  const money = value instanceof BigNumber ? value : new BigNumber(value);
  const moneyInPrimaryBase = money.div(new BigNumber(10).pow(currencyDecimals));
  return decimalPlaces !== undefined
    ? formatToFixed(moneyInPrimaryBase, decimalPlaces, roundingMode)
    : moneyInPrimaryBase.toString();
}
