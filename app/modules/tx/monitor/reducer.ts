import { ITxMonitorState } from "../interfaces";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";



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
  }

  return state;
};
