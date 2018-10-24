import { ITxData } from "../../../lib/web3/Web3Manager";
import { AppReducer } from "../../../store";

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}

export type TxSenderState =
  | "UNINITIALIZED"
  | "WATCHING_PENDING_TXS"
  | "INIT"
  | "SUMMARY"
  | "ACCESSING_WALLET"
  | "SIGNING"
  | "MINING"
  | "DONE"
  | "ERROR_SIGN"
  | "REVERTED";

export interface ITxSenderState {
  state: TxSenderState;
  type?: ETxSenderType;
  txDetails?: ITxData;
  blockId?: number;
  txHash?: string;
  error?: string;
}

const initialState: ITxSenderState = {
  state: "UNINITIALIZED",
};

export const txSenderReducer: AppReducer<ITxSenderState> = (
  state = initialState,
  action,
): ITxSenderState => {
  switch (action.type) {
    // Modal related Actions
    case "TX_SENDER_SHOW_MODAL":
      return {
        ...initialState,
        state: "WATCHING_PENDING_TXS",
        type: action.payload.type,
      };

    case "TX_SENDER_HIDE_MODAL":
      return {
        ...initialState,
      };

    //Pending Transaction Actions
    case "TX_SENDER_WATCH_PENDING_TXS":
      return {
        ...initialState,
        state: "WATCHING_PENDING_TXS",
      };

    case "TX_SENDER_WATCH_PENDING_TXS_DONE":
      return {
        ...initialState,
        state: "INIT",
        type: action.payload.type,
      };
    case "TX_SENDER_ACCEPT":
      return {
        ...state,
        state: "ACCESSING_WALLET",
      };

    case "TX_SENDER_WALLET_PLUGGED":
      return {
        ...state,
        state: "SIGNING",
      };
    case "TX_SENDER_ACCEPT_DRAFT":
      return {
        ...state,
        state: "SUMMARY",
        txDetails: {
          ...state.txDetails,
          ...action.payload,
        },
      };
    case "TX_SENDER_SIGNED":
      return {
        ...state,
        state: "MINING",
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
        state: "DONE",
      };
    //Error Actions
    case "TX_SENDER_ERROR":
      return {
        ...initialState,
        state: "ERROR_SIGN",
        error: action.payload.error,
      };
    //Change Actions
    case "TX_SENDER_CHANGE":
      return {
        ...state,
        state: "INIT",
        type: action.payload.type,
      };
  }

  return state;
};
