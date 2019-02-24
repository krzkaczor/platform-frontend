import BigNumber from "bignumber.js";
import { curry } from "lodash/fp";

import { Q18 } from "../config/constants";
import { invariant } from "./invariant";

export function isZero(value: string): boolean {
  const bigNumberValue = new BigNumber(value);

  return bigNumberValue.isZero();
}

/**
 * Assumes dot as decimal separator
 */
export function formatThousands(value?: BigNumber | string | null): string {
  if (!value) return "";
  if (typeof value !== "string") {
    value = value.toString(10);
  }
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, `Can't format this number: ${value}`);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return `${formattedBeforeDot}.${splitByDot[1]}`;
  }
  return formattedBeforeDot;
}

//FIXME find out what it does and rename it to be understandable
export function convertToBigInt(value: string, currencyDecimals?: number): BigNumber {
  const q = currencyDecimals ? new BigNumber(10).pow(currencyDecimals) : Q18;
  return q.mul(value);
}

export function formatFlexiPrecision(
  value: BigNumber,
  maxPrecision: number,
  minPrecision = 0,
  useGrouping = false,
): string {
  return parseFloat(value.toString(10)).toLocaleString(undefined, {
    maximumFractionDigits: maxPrecision,
    minimumFractionDigits: minPrecision,
    useGrouping,
  });
}

type TNormalizeOptions = { min: BigNumber; max: BigNumber };

function normalizeValue(options: TNormalizeOptions, value: BigNumber): BigNumber {
  const minAllowed = new BigNumber(0);
  const maxAllowed = new BigNumber(1);

  return (
    // ((maxAllowed - minAllowed) * (value - options.min)) / (options.max - options.min) + minAllowed
    maxAllowed
      .minus(minAllowed)
      .mul(value.minus(options.min))
      .div(options.max.minus(options.min))
      .add(minAllowed)
  );
}

export const normalize = curry(normalizeValue);
