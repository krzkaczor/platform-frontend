import BigNumber from "bignumber.js";

import { convert } from "../../components/eto/utils";
import { IAppState } from "../../store";
import { calculateGasPriceWithOverhead } from "../tx/utils";
import * as gasModelInterfaces from "./interfaces";

export const selectIsGasPriceAlreadyLoaded = (state: IAppState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: IAppState): gasModelInterfaces.IBlGasModel | undefined => {
  return state.gas.gasPrice
    ? convert(state.gas.gasPrice, gasModelInterfaces.stateToBlConversionSpec)
    : undefined;
};

export const selectStandardGasPrice = (state: IAppState): BigNumber => {
  return state.gas.gasPrice && state.gas.gasPrice.standard
    ? new BigNumber(state.gas.gasPrice.standard)
    : new BigNumber("0");
};

export const selectStandardGasPriceWithOverHead = (state: IAppState): BigNumber =>
  (state.gas.gasPrice &&
    calculateGasPriceWithOverhead(new BigNumber(state.gas.gasPrice.standard))) ||
  new BigNumber("0");
