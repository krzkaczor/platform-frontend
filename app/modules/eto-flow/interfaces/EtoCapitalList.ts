import BigNumber from "bignumber.js";

import { NumericString } from "../../../types";
import {
  bigNumberToNumber,
  bigNumberToNumericString,
  numberToNumericString,
  numericStringToBigNumber,
  numericStringToNumber,
} from "../../../utils/numericStringUtils";

export interface IStateEtoCapitalList {
  description: string;
  percent: NumericString;
}

export interface IApiEtoCapitalList {
  description: string;
  percent: number;
}

export interface IBlEtoCapitalList {
  description: string;
  percent: BigNumber;
}

export const apiToStateConversionSpec = {
  percent: numberToNumericString(),
};

export const stateToBlConversionSpec = {
  percent: numericStringToBigNumber(),
};

export const blToApiConversionSpec = {
  percent: bigNumberToNumber(),
};

export const stateToApiConversionSpec = {
  percent: numericStringToNumber(),
};

export const blToStateConversionSpec = {
  percent: bigNumberToNumericString(),
};
