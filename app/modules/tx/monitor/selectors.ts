import { Tx, TxWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { ETxSenderType, TAdditionalDataByType } from "../types";
import { ITxMonitorState } from "./reducer";

export const selectAreTherePendingTxs = (state: ITxMonitorState): boolean => {
  return !!(state.txs.pendingTransaction || state.txs.oooTransactions.length);
};

export const selectMonitoredPendingTransaction = (state: IAppState): TxWithMetadata | undefined => {
  return state.txMonitor.txs.pendingTransaction as TxWithMetadata | undefined;
};

export const selectMonitoredTxAdditionalData = <T extends ETxSenderType>(
  state: IAppState,
): TAdditionalDataByType<T> | undefined => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  if (pendingTransaction) {
    return (pendingTransaction as any).transactionAdditionalData;
  }

  return undefined;
};

export const selectMonitoredTxData = (state: IAppState): Tx | undefined => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  if (pendingTransaction) {
    return pendingTransaction.transaction;
  }

  return undefined;
};

export const selectMonitoredTxTimestamp = (state: IAppState): number | undefined => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  if (pendingTransaction) {
    return pendingTransaction.transactionTimestamp;
  }

  return undefined;
};
