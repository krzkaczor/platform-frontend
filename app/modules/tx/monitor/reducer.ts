import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";
import { actions } from "../../actions";

export interface ITxMonitorState {
  txs: TPendingTxs;
}

const initialState: ITxMonitorState = {
  txs: { pendingTransaction: undefined, oooTransactions: [] },
};

export const txMonitorReducer: AppReducer<ITxMonitorState> = (
  state = initialState,
  action,
): DeepReadonly<ITxMonitorState> => {
  switch (action.type) {
    case "TX_MONITOR_LOAD_TXS":
      return {
        txs: action.payload.txs,
      };
    case actions.txMonitor.deletePendingTx.getType():
      return initialState;
  }

  return state;
};
