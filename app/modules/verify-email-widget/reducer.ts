import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateVerifyEmailWidget } from "./interfaces";

const verifyEmailWidgetInitialState: IStateVerifyEmailWidget = { isButtonLocked: false };

export const verifyEmailWidgetReducer: AppReducer<IStateVerifyEmailWidget> = (
  state = verifyEmailWidgetInitialState,
  action,
): DeepReadonly<IStateVerifyEmailWidget> => {
  switch (action.type) {
    case "VERIFY_EMAIL_BUTTON_LOCK":
      return {
        ...state,
        isButtonLocked: true,
      };
    case "VERIFY_EMAIL_BUTTON_UNLOCK":
      return {
        ...state,
        isButtonLocked: false,
      };
  }

  return state;
};

export const selectIsConnectedButtonLocked = (state: IStateVerifyEmailWidget): boolean =>
  state.isButtonLocked;
