import { TxPendingWithMetadata, TxWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { ETxSenderState } from "../sender/reducer";

export const selectAreTherePendingTxs = (state: IAppState): boolean => {
  const oooTransactions = state.txMonitor.txs.oooTransactions;

  return selectAreTherePlatformPendingTxs(state) || oooTransactions.length > 0;
};

export const selectAreTherePlatformPendingTxs = (state: IAppState): boolean => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  return !!pendingTransaction && pendingTransaction.transactionStatus === ETxSenderState.MINING;
};

export const selectPendingTransaction = (state: IAppState): TxPendingWithMetadata | undefined => {
  return state.txMonitor.txs.pendingTransaction as TxPendingWithMetadata | undefined;
};

export const selectExternalPendingTransaction = (state: IAppState): TxWithMetadata | undefined => {
  return state.txMonitor.txs.oooTransactions[0];
};
