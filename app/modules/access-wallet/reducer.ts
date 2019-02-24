import { AppReducer } from "../../store";
import { IStateSignMessageModal } from "./interfaces";

const initialState: IStateSignMessageModal = {
  isModalOpen: false,
};

export const accessWalletReducer: AppReducer<IStateSignMessageModal> = (
  state = initialState,
  action,
): IStateSignMessageModal => {
  switch (action.type) {
    case "SHOW_ACCESS_WALLET_MODAL":
      return {
        ...state,
        isModalOpen: true,
        errorMessage: undefined,
        modalTitle: action.payload.title,
        modalMessage: action.payload.message,
      };
    case "HIDE_ACCESS_WALLET_MODAL":
      return {
        ...state,
        isModalOpen: false,
      };
    case "ACCESS_WALLET_SIGNING_ERROR":
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
    case "ACCESS_WALLET_CLEAR_SIGNING_ERROR":
    case "ACCESS_WALLET_ACCEPT":
      return {
        ...state,
        errorMessage: undefined,
      };
  }

  return state;
};

export const selectIsSigning = (state: IStateSignMessageModal): boolean => state.isModalOpen;
