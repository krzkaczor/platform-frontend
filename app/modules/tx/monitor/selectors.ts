import { Tx } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { TSpecificTransactionState } from "../types";
import { ITxMonitorState } from "./reducer";

export const selectAmountOfPendingTxs = (state: ITxMonitorState): number => {
  return state.txs.oooTransactions.length + (state.txs.pendingTransaction ? 1 : 0);
};

export const selectAreTherePendingTxs = (state: ITxMonitorState): boolean => {
  return !!(state.txs.pendingTransaction || state.txs.oooTransactions.length);
};

export const selectMonitoredTxAdditionalData = (
  state: IAppState,
): TSpecificTransactionState["additionalData"] | undefined => {
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
