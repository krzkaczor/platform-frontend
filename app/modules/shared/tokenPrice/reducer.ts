import { AppReducer } from "../../../store";
import { IStateTokenPrice } from "./interfaces";

const walletInitialState: IStateTokenPrice = {
  loading: true,
};

export const tokenPriceReducer: AppReducer<IStateTokenPrice> = (
  state = walletInitialState,
  action,
): IStateTokenPrice => {
  switch (action.type) {
    case "TOKEN_PRICE_LOAD_START":
      return {
        ...state,
        loading: true,
      };
    case "TOKEN_PRICE_SAVE":
      return {
        ...state,
        loading: false,
        tokenPriceData: action.payload,
      };
  }

  return state;
};
