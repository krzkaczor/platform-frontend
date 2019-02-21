import { ITxMonitorState } from "./reducer";

export const selectAmountOfPendingTxs = (state: ITxMonitorState): number => {
  return state.txs.oooTransactions.length + (state.txs.pendingTransaction ? 1 : 0);
};

export const selectAreTherePendingTxs = (state: ITxMonitorState): boolean => {
  return !!(state.txs.pendingTransaction && state.txs.oooTransactions.length)
};
