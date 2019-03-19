import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { createAction } from "../../actionsUtils";

export const txMonitorActions = {
  setPendingTxs: (txs: Partial<TPendingTxs>) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
};
