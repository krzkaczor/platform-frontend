import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IBlPersonProfileModalObject, IStatePersonProfileModal } from "./interfaces";

const initialState: IStatePersonProfileModal = {
  isOpen: false,
};

export const personProfileModalReducer: AppReducer<IStatePersonProfileModal> = (
  state = initialState,
  action,
): DeepReadonly<IStatePersonProfileModal> => {
  switch (action.type) {
    case "PERSON_PROFILE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        personProfileModalObj: action.payload,
      };
    case "PERSON_PROFILE_MODAL_HIDE":
      return {
        ...state,
        personProfileModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectIsOpen = (state: DeepReadonly<IStatePersonProfileModal>): boolean =>
  state.isOpen;
export const selectPersonProfileModalObj = (
  state: DeepReadonly<IStatePersonProfileModal>,
): IBlPersonProfileModalObject | undefined =>
  state.personProfileModalObj
    ? (state.personProfileModalObj as IBlPersonProfileModalObject)
    : undefined;
