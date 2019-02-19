import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export enum EBankTransferFlowState {
  UNINITIALIZED = "uninitialized",
  INIT = "init",
  DETAILS = "details",
  SUMMARY = "summary",
}

/**
 * This enum should use two character value convention as it's injected into reference code
 */
export enum EBankTransferType {
  PURCHASE = "PU",
}

export interface IBankTransferState {
  state: EBankTransferFlowState;
  type: EBankTransferType | undefined;
  minEuroUlps: string;
  reference: string;
}

export const bankTransferInitialState: IBankTransferState = {
  state: EBankTransferFlowState.UNINITIALIZED,
  type: undefined,
  minEuroUlps: "",
  reference: "",
};

export const bankTransferFlowReducer: AppReducer<IBankTransferState> = (
  state = bankTransferInitialState,
  action,
): DeepReadonly<IBankTransferState> => {
  switch (action.type) {
    case actions.bankTransferFlow.startBankTransfer.getType():
      return {
        ...state,
        state: EBankTransferFlowState.INIT,
        type: action.payload.type,
      };

    case actions.bankTransferFlow.continueToDetails.getType():
      return {
        ...state,
        reference: action.payload.reference,
        minEuroUlps: action.payload.minEuroUlps,
        state: EBankTransferFlowState.DETAILS,
      };
    case actions.bankTransferFlow.continueToSummary.getType():
      return {
        ...state,
        state: EBankTransferFlowState.SUMMARY,
      };

    case actions.bankTransferFlow.stopBankTransfer.getType():
      return bankTransferInitialState;
  }

  return state;
};
