import BigNumber from "bignumber.js";
import {NumericString} from "../../../types";
import {bigNumberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateCalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: NumericString;
  maxTicketEurUlps: NumericString;
  equityTokenInt: NumericString;
  neuRewardUlps: NumericString;
  maxCapExceeded: boolean;
}

export interface IBlCalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: BigNumber;
  maxTicketEurUlps: BigNumber;
  equityTokenInt: BigNumber;
  neuRewardUlps: BigNumber;
  maxCapExceeded: boolean;
}

export const blToStateConversionSpec = {
  minTicketEurUlps: bigNumberToNumericString(),
  maxTicketEurUlps: bigNumberToNumericString(),
  equityTokenInt: bigNumberToNumericString(),
  neuRewardUlps: bigNumberToNumericString(),
};

export const stateToBlConversionSpec = {
  minTicketEurUlps: numericStringToBigNumber(),
  maxTicketEurUlps: numericStringToBigNumber(),
  equityTokenInt: numericStringToBigNumber(),
  neuRewardUlps: numericStringToBigNumber(),
};
