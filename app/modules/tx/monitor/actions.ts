import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { createAction, createActionFactory } from "../../actionsUtils";

export const txMonitorActions = {
  setPendingTxs: (txs: TPendingTxs) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
  deletePendingTx: createActionFactory("TX_MONITOR_DELETE_PENDING_TX"),
};
