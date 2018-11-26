import { createAction, createSimpleAction } from "../actionsUtils";
import { ErrorWithData} from "../../config/errorMessages";

export const accessWalletActions = {
  showAccessWalletModal: (title: string, message: string) =>
    createAction("SHOW_ACCESS_WALLET_MODAL", { title, message }),
  hideAccessWalletModal: () => createSimpleAction("HIDE_ACCESS_WALLET_MODAL"),
  signingError: (errorMessage: ErrorWithData) => createAction("ACCESS_WALLET_SIGNING_ERROR", { errorMessage }),
  clearSigningError: () => createSimpleAction("ACCESS_WALLET_CLEAR_SIGNING_ERROR"),
  accept: (password?: string) => createAction("ACCESS_WALLET_ACCEPT", { password }),
};
