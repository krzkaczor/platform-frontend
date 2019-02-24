import BigNumber from "bignumber.js";

import { NumericString } from "../../../types";
import { numericStringToBigNumber } from "../../../utils/numericStringUtils";

export interface IStateEtoTotalInvestment {
  totalEquivEurUlps: NumericString;
  totalTokensInt: NumericString;
  totalInvestors: NumericString;
  euroTokenBalance: NumericString;
  etherTokenBalance: NumericString;
}

export interface IBlEtoTotalInvestment {
  totalEquivEurUlps: BigNumber;
  totalTokensInt: BigNumber;
  totalInvestors: BigNumber;
  euroTokenBalance: BigNumber;
  etherTokenBalance: BigNumber;
}

export interface IApiEtoTotalInvestment {
  totalEquivEurUlps: BigNumber;
  totalTokensInt: BigNumber;
  totalInvestors: BigNumber;
  euroTokenBalance: BigNumber;
  etherTokenBalance: BigNumber;
}

export const stateToBlConversionSpec = {
  totalEquivEurUlps: numericStringToBigNumber(),
  totalTokensInt: numericStringToBigNumber(),
  totalInvestors: numericStringToBigNumber(),
  euroTokenBalance: numericStringToBigNumber(),
  etherTokenBalance: numericStringToBigNumber(),
};
