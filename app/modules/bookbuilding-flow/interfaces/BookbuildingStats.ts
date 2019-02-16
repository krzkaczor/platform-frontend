import {NumericString} from "../../../types";
import BigNumber from "bignumber.js";
import {numericStringToBigNumber} from "../../../utils/numericStringUtils";

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
  pledgedAmount: numericStringToBigNumber()
};
