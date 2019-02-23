import BigNumber from "bignumber.js";
import {NumericString} from "../../../types";
import {numberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateBookBuildingStats {
  investorsCount: number;
  pledgedAmount: NumericString;
}

export interface IBlBookBuildingStats {
  investorsCount: BigNumber;
  pledgedAmount: BigNumber;
}

export interface IApiBookBuildingStats {
  investorsCount: number;
  pledgedAmount: number;
}

export const stateToBlConversionSpec = {
  investorsCount: numericStringToBigNumber(),
  pledgedAmount: numericStringToBigNumber()
};


export const apiToStateConversionSpec = {
  investorsCount: numberToNumericString(),
  pledgedAmount: numberToNumericString()
};
