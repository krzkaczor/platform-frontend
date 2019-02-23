import BigNumber from "bignumber.js";

import {convert} from "../../../components/eto/utils";
import * as txDataInterfaces from "../../../modules/web3/interfaces";
import { IAppState } from "../../../store";
import { ETxSenderType } from "../interfaces";
import { ETxSenderState, EValidationState } from "./interfaces";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState):txDataInterfaces.IBlTxData | undefined =>
  convert(state.txSender.txDetails, txDataInterfaces.stateToBlConversionSpec);

export const selectTxType = (state: IAppState): ETxSenderType | undefined => state.txSender.type;

export const selectTxSummaryData = (state: IAppState): Partial<txDataInterfaces.IBlTxData> | txDataInterfaces.IBlTxData | undefined =>
  (state.txSender.summaryData && convert(state.txSender.summaryData.txData, txDataInterfaces.stateToBlConversionSpec))
  || convert(state.txSender.txDetails, txDataInterfaces.stateToBlConversionSpec);

export const selectTxSummaryAdditionalData = (state: IAppState) =>
  state.txSender.summaryData && state.txSender.summaryData.additionalData;

export const selectTxGasCostEthUlps = (state: IAppState): BigNumber => {
  const details = selectTxDetails(state);
  const gasPrice = (details && details.gasPrice) || new BigNumber("0");
  const gasLimit = (details && details.gas) || new BigNumber("0");
  return gasPrice.mul(gasLimit)
};

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txSender.validationState;
