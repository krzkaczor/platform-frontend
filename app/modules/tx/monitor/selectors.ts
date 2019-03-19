import { Tx, TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { ETxSenderState } from "../sender/reducer";
import { ETxSenderType, TAdditionalDataByType } from "../types";

export const selectAreTherePendingTxs = (state: IAppState): boolean => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  const oooTransactions = state.txMonitor.txs.oooTransactions;

  return !!(
    (pendingTransaction && pendingTransaction.transactionStatus === ETxSenderState.MINING) ||
    oooTransactions.length
  );
};

export const selectMonitoredPendingTransaction = (
  state: IAppState,
): TxPendingWithMetadata | undefined => {
  return state.txMonitor.txs.pendingTransaction as TxPendingWithMetadata | undefined;
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
