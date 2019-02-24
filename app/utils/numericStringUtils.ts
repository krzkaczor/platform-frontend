import BigNumber from "bignumber.js";

import { NumericString } from "../types";

export const numberToNumericString = () => (x: number): NumericString =>
  x !== undefined || x !== null ? (x.toString() as NumericString) : x;
export const numericStringToBigNumber = (base: number = 10) => (x: NumericString) =>
  x !== undefined || x !== null ? new BigNumber(x, base) : x;
export const bigNumberToNumericString = () => (x: BigNumber) =>
  x !== undefined || x !== null ? (x.toString() as NumericString) : x;
export const numericStringToNumber = () => (x: NumericString) =>
  x !== undefined || x !== null ? parseFloat(x) : x;
export const bigNumberToNumber = () => (x: BigNumber) =>
  x !== undefined || x !== null ? x.toNumber() : x;
