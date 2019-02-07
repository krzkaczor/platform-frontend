import { AppReducer } from "../../store";
import {IWalletSelectorState} from './interfaces';

const walletSelectorInitialState: IWalletSelectorState = {
  isMessageSigning: false,
};

export const walletSelectorReducer: AppReducer<IWalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState => {
  switch (action.type) {
    case "WALLET_SELECTOR_MESSAGE_SIGNING":
      return {
        ...state,
        isMessageSigning: true,
        messageSigningError: undefined,
      };
    case "WALLET_SELECTOR_MESSAGE_SIGNING_ERROR":
      return {
        ...state,
        messageSigningError: action.payload.errorMessage,
      };
    case "WALLET_SELECTOR_RESET":
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: undefined,
      };
  }

  return state;
};
