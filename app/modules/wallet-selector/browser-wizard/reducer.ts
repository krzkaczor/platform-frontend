import { TMessage } from "../../../components/translatedMessages/utils";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";

export interface IBrowserWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
  approvalRejected: boolean;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {
  isLoading: true,
  approvalRejected: false,
};

export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case "BROWSER_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case "BROWSER_WALLET_APPROVAL_REJECTED":
      return {
        ...state,
        isLoading: false,
        approvalRejected: true,
      };
    case "BROWSER_WALLET_APPROVAL_REQUEST_RESET":
      return {
        ...state,
        approvalRejected: false,
      };
  }

  return state;
};
