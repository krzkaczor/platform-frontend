import BigNumber from "bignumber.js";
import { NumericString } from "../../../types";
import {
  bigNumberToNumericString,
  numericStringToBigNumber,
} from "../../../utils/numericStringUtils";

export interface IStateInvestorTicket {
  equivEurUlps: NumericString;
  rewardNmkUlps: NumericString;
  equityTokenInt: NumericString;
  sharesInt: NumericString;
  tokenPrice: NumericString;
  neuRate: NumericString;
  amountEth: NumericString;
  amountEurUlps: NumericString;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export interface IBlInvestorTicket {
  equivEurUlps: BigNumber;
  rewardNmkUlps: BigNumber;
  equityTokenInt: BigNumber;
  sharesInt: BigNumber;
  tokenPrice: BigNumber;
  neuRate: BigNumber;
  amountEth: BigNumber;
  amountEurUlps: BigNumber;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export const blToStateConversionSpec = {
  equivEurUlps: bigNumberToNumericString(),
  rewardNmkUlps: bigNumberToNumericString(),
  equityTokenInt: bigNumberToNumericString(),
  sharesInt: bigNumberToNumericString(),
  tokenPrice: bigNumberToNumericString(),
  neuRate: bigNumberToNumericString(),
  amountEth: bigNumberToNumericString(),
  amountEurUlps: bigNumberToNumericString(),
};

export const stateToBlConversionSpec = {
  equivEurUlps: numericStringToBigNumber(),
  rewardNmkUlps: numericStringToBigNumber(),
  equityTokenInt: numericStringToBigNumber(),
  sharesInt: numericStringToBigNumber(),
  tokenPrice: numericStringToBigNumber(),
  neuRate: numericStringToBigNumber(),
  amountEth: numericStringToBigNumber(),
  amountEurUlps: numericStringToBigNumber(),
};
