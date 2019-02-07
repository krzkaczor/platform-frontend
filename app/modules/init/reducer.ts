import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import {IInitState} from './interfaces'

export const initInitialState: IInitState = {
  appInit: {
    done: false,
    inProgress: false,
  },
  smartcontractsInit: {
    done: false,
    inProgress: false,
  },
};

export const initReducer: AppReducer<IInitState> = (
  state = initInitialState,
  action,
): DeepReadonly<IInitState> => {
  switch (action.type) {
    case "INIT_START":
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: true,
          done: false,
        },
      };
    case "INIT_DONE":
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: false,
          done: true,
        },
      };
    case "INIT_ERROR":
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: false,
          done: false,
          error: action.payload.errorMsg,
        },
      };
  }

  return state;
};
