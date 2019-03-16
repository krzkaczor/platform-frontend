import { TMessage } from "../../components/translatedMessages/utils";
import { createActionFactory } from "../actionsUtils";

export const accessWalletActions = {
  showAccessWalletModal: createActionFactory(
    "SHOW_ACCESS_WALLET_MODAL",
    (title: TMessage, message: TMessage) => ({ title, message }),
  ),
  hideAccessWalletModal: createActionFactory("HIDE_ACCESS_WALLET_MODAL"),
  signingError: createActionFactory("ACCESS_WALLET_SIGNING_ERROR", (errorMessage: TMessage) => ({
    errorMessage,
  })),
  clearSigningError: createActionFactory("ACCESS_WALLET_CLEAR_SIGNING_ERROR"),
  accept: createActionFactory("ACCESS_WALLET_ACCEPT", (password?: string) => ({ password })),
};
