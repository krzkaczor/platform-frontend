import BigNumber from "bignumber.js";

import { NumericString } from "../../types";
import { numberToNumericString, numericStringToBigNumber } from "../../utils/numericStringUtils";

export interface IGasState {
  loading: boolean;
  gasPrice?: IStateGasModel;
  error?: string;
}

export interface IStateGasModel {
  fast: NumericString;
  fastest: NumericString;
  safeLow: NumericString;
  standard: NumericString;
}

export interface IBlGasModel {
  fast: BigNumber;
  fastest: BigNumber;
  safeLow: BigNumber;
  standard: BigNumber;
}

export interface IApiGasModel {
  fast: number;
  fastest: number;
  safeLow: number;
  standard: number;
}

export const stateToBlConversionSpec = {
  fast: numericStringToBigNumber(),
  fastest: numericStringToBigNumber(),
  safeLow: numericStringToBigNumber(),
  standard: numericStringToBigNumber(),
};

export const apiToStateConversionSpec = {
  fast: numberToNumericString(),
  fastest: numberToNumericString(),
  safeLow: numberToNumericString(),
  standard: numberToNumericString(),
};
