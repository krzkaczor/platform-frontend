import { AppReducer } from "../../store";

import { IStateWallet } from "./interfaces";

const walletInitialState: IStateWallet = {
  loading: true,
};

export const walletReducer: AppReducer<IStateWallet> = (
  state = walletInitialState,
  action,
): IStateWallet => {
  switch (action.type) {
    case "WALLET_SAVE_WALLET_DATA":
      return {
        loading: false,
        error: undefined,
        data: action.payload.data,
      };
    case "WALLET_LOAD_WALLET_DATA_ERROR":
      return {
        loading: false,
        error: action.payload.errorMsg,
        data: state.data,
      };
  }

  return state;
};
