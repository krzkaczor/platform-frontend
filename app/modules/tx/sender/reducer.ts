import { AppReducer } from "../../../store";
import {ETxSenderState, IStateTxSender} from './interfaces'

const initialState: IStateTxSender = {
  state: ETxSenderState.UNINITIALIZED,
};

export const txSenderReducer: AppReducer<IStateTxSender> = (
  state = initialState,
  action,
): IStateTxSender => {
  switch (action.type) {
    // Modal related Actions
    case "TX_SENDER_SHOW_MODAL":
    case "TX_SENDER_HIDE_MODAL":
      return {
        ...initialState,
      };

    //Pending Transaction Actions
    case "TX_SENDER_WATCH_PENDING_TXS":
      return {
        ...initialState,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        txHash: action.payload.txHash,
      };

    case "TX_SENDER_WATCH_PENDING_TXS_DONE":
      return {
        ...initialState,
        state: ETxSenderState.INIT,
        type: action.payload.type,
      };
    case "TX_SENDER_ACCEPT":
      return {
        ...state,
        state: ETxSenderState.ACCESSING_WALLET,
      };
    case "TX_SENDER_SET_TRANSACTION_DATA":
      return {
        ...state,
        txDetails: action.payload.txData,
      };
    case "TX_SENDER_WALLET_PLUGGED":
      return {
        ...state,
        state: ETxSenderState.SIGNING,
      };
    case "TX_SENDER_SIGNED":
      return {
        ...state,
        state: ETxSenderState.MINING,
        txHash: action.payload.txHash,
        type: action.payload.type,
      };

    case "TX_SENDER_REPORT_BLOCK":
      return {
        ...state,
        blockId: action.payload,
      };

    case "TX_SENDER_TX_MINED":
      return {
        ...state,
        state: ETxSenderState.DONE,
      };

    case "TX_SENDER_ERROR":
      return {
        ...initialState,
        state: ETxSenderState.ERROR_SIGN,
        error: action.payload.error,
      };
    case "TX_SENDER_SET_VALIDATION_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "TX_SENDER_VALIDATE_DRAFT":
      return {
        ...state,
        validationState: undefined,
      };
    case "TX_SENDER_CONTINUE_TO_SUMMARY_WITH_DATA":
      return {
        ...state,
        state: ETxSenderState.SUMMARY,
        summaryData: action.payload.summaryData,
      };
    //Change Actions
    case "TX_SENDER_CHANGE":
      return {
        ...state,
        state: ETxSenderState.INIT,
        type: action.payload.type,
      };
  }

  return state;
};
