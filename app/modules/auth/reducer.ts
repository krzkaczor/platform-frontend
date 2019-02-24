import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateAuth } from "./interfaces";

const authInitialState: IStateAuth = {};

export const authReducer: AppReducer<IStateAuth> = (
  state = authInitialState,
  action,
): DeepReadonly<IStateAuth> => {
  switch (action.type) {
    case "AUTH_SET_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    case "AUTH_LOAD_JWT":
      return {
        ...state,
        jwt: action.payload.jwt,
      };
    case "SET_CURRENT_AGREEMENT_HASH":
      return {
        ...state,
        currentAgreementHash: action.payload.currentAgreementHash,
      };
    //Log out is done on whole state instead of just AUTH reducer
  }

  return state;
};
