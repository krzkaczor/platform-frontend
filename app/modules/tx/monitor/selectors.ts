import { TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { ETxSenderState } from "../sender/reducer";

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

export const selectMonitoredTxTimestamp = (state: IAppState): number | undefined => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  if (pendingTransaction) {
    return pendingTransaction.transactionTimestamp;
  }

  return undefined;
};
