import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { ETxSenderType, TAdditionalDataByType } from "../types";
import { ETxSenderState, EValidationState } from "./reducer";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState) => state.txSender.txDetails;

export const selectTxType = (state: IAppState) => state.txSender.type;

export const selectTxAdditionalData = <T extends ETxSenderType>(
  state: IAppState,
): TAdditionalDataByType<T> | undefined => state.txSender.additionalData;

export const selectTxTimestamp = (state: IAppState): number | undefined =>
  state.txSender.txTimestamp;

export const selectTxGasCostEthUlps = (state: IAppState): string => {
  const details = selectTxDetails(state);
  const gasPrice = (details && details.gasPrice) || "0";
  const gasLimit = (details && details.gas) || "0";
  return multiplyBigNumbers([gasPrice, gasLimit]);
};

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txSender.validationState;
