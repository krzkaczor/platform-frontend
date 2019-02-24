import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateGenericModal } from "./interfaces";

const initialState: IStateGenericModal = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IStateGenericModal> = (
  state = initialState,
  action,
): DeepReadonly<IStateGenericModal> => {
  switch (action.type) {
    case "GENERIC_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        genericModalObj: action.payload,
      };
    case "MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        component: action.payload.component,
      };
    case "GENERIC_MODAL_HIDE":
      return initialState;
  }

  return state;
};
