import { createAction, createSimpleAction } from "../actionsUtils";
import { IStateGasModel } from "./interfaces";

export const gasActions = {
  gasApiEnsureLoading: () => createSimpleAction("GAS_API_ENSURE_LOADING"),
  gasApiStartLoading: () => createSimpleAction("GAS_API_START_LOADING"),
  gasApiLoaded: (payload: { data?: IStateGasModel; error?: string }) =>
    createAction("GAS_API_LOADED", payload),
};
