import BigNumber from "bignumber.js";

import {NumericString} from "../../../types";
import {ECurrency} from "../../../components/shared/Money";
import {
  numberToNumericString,
  numericStringToBigNumber,
  numericStringToNumber
} from "../../../utils/numericStringUtils";

export interface IApiPledge {
  amountEur: number;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
}

export interface IStatePledge {
  amountEur: NumericString;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
}

export interface IBlPledge {
  amountEur: BigNumber;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
}

export const stateToApiConversionSpec = {
  amountEur: numericStringToNumber()
};

export const apiToStateConversionSpec = {
  amountEur: numberToNumericString()
};

export const stateToBlConversionSpec = {
  amountEur: numericStringToBigNumber()
};
