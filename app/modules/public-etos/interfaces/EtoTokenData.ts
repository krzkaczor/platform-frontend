import BigNumber from "bignumber.js";

import { NumericString } from "../../../types";
import { numericStringToBigNumber } from "../../../utils/numericStringUtils";

export interface IStateEtoTokenData {
  balance: NumericString;
  tokensPerShare: NumericString;
  totalCompanyShares: NumericString;
  companyValuationEurUlps: NumericString;
  tokenPrice: NumericString;
}

export interface IBlEtoTokenData {
  balance: BigNumber;
  tokensPerShare: BigNumber;
  totalCompanyShares: BigNumber;
  companyValuationEurUlps: BigNumber;
  tokenPrice: BigNumber;
}

export const stateToBlConversionSpec = {
  balance: numericStringToBigNumber(),
  tokensPerShare: numericStringToBigNumber(),
  totalCompanyShares: numericStringToBigNumber(),
  companyValuationEurUlps: numericStringToBigNumber(),
  tokenPrice: numericStringToBigNumber(),
};
