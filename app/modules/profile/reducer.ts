import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import {IProfile} from './interfaces'
import { actions } from "../actions";


const initialState: IProfile = {
  isEmailTemporaryCancelled: false,
};

export const profileReducer: AppReducer<IProfile> = (
  state = initialState,
  action,
): DeepReadonly<IProfile> => {
  switch (action.type) {
    case actions.profile.cancelEmail.getType():
      return {
        ...state,
        isEmailTemporaryCancelled: true,
      };
    case actions.profile.addNewEmail.getType():
    case actions.profile.revertCancelEmail.getType():
      return {
        ...state,
        isEmailTemporaryCancelled: false,
      };
  }

  return state;
};

export const selectIsCancelEmail = (state: IProfile): boolean => state.isEmailTemporaryCancelled;
