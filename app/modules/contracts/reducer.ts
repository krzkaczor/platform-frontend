import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateContract } from "./interfaces";

const contractsInitialState: IStateContract = {
  platformTermsConstants: {} as any,
  // initially empty. But contract should be initialized first on application start,
  // and values are set throughout the app lifetime
};

export const contractsReducer: AppReducer<IStateContract> = (
  state = contractsInitialState,
  action,
): DeepReadonly<IStateContract> => {
  switch (action.type) {
    case "CONTRACTS_SET_PLATFORM_TERM_CONSTANTS":
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};
