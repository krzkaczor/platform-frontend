import { AppReducer } from "../../../store";
import { ILightWalletWizardState } from "./interfaces";

export const lightWalletWizardInitialState: ILightWalletWizardState = { isLoading: false };

export const lightWalletWizardReducer: AppReducer<ILightWalletWizardState> = (
  state = lightWalletWizardInitialState,
  action,
): ILightWalletWizardState => {
  switch (action.type) {
    case "LIGHT_WALLET_LOGIN":
    case "LIGHT_WALLET_REGISTER":
      return {
        ...state,
        errorMsg: undefined,
        isLoading: true,
      };
    case "LIGHT_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case "WALLET_SELECTOR_CONNECTED":
    case "WALLET_SELECTOR_RESET":
      return {
        ...state,
        isLoading: false,
        errorMsg: undefined,
      };
  }
  return state;
};
