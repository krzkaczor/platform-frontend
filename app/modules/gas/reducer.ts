import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IGasState } from "./interfaces";

export const gasInitialState: IGasState = {
  loading: false,
};

export const gasReducer: AppReducer<IGasState> = (
  state = gasInitialState,
  action,
): DeepReadonly<IGasState> => {
  switch (action.type) {
    case "GAS_API_START_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "GAS_API_LOADED":
      return {
        ...state,
        gasPrice: action.payload.data || state.gasPrice,
        error: action.payload.error,
      };
  }

  return state;
};
