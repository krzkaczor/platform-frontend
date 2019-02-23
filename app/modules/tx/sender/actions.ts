import {createAction, createActionFactory, createSimpleAction} from "../../actionsUtils";
import { IStateTxData} from "../../web3/interfaces";
import { ETxSenderType } from "../interfaces";
import { ETransactionErrorType, TSummaryData } from "./interfaces";

export const txSenderActions = {
  // Modal related actions
  txSenderShowModal: (type: ETxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  // User awaiting actions
  txSenderAcceptDraft: createActionFactory(
    "TX_SENDER_ACCEPT_DRAFT",
    (txDraftData?: Partial<IStateTxData>) => ({ txDraftData }),
  ),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderChange: (type: ETxSenderType) => createAction("TX_SENDER_CHANGE", { type }),
  // Signer actions
  txSenderSigned: (txHash: string, type: ETxSenderType) =>
    createAction("TX_SENDER_SIGNED", { txHash, type }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  // Block mining actions
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
  // Pending transaction related actions
  txSenderWatchPendingTxs: (txHash: string) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS", { txHash }),
  txSenderWatchPendingTxsDone: (type: ETxSenderType) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS_DONE", { type }),
  // Error Actions
  txSenderError: (error: ETransactionErrorType) => createAction("TX_SENDER_ERROR", { error }),
  // Flow Actions
  txSenderContinueToSummary: (summaryData?: TSummaryData) =>
    createAction("TX_SENDER_CONTINUE_TO_SUMMARY_WITH_DATA", { summaryData }),

  // reducer setters
  setTransactionData: (txData?: IStateTxData) =>
    createAction("TX_SENDER_SET_TRANSACTION_DATA", { txData }),
};
