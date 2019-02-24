import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IDepositEthModalState } from "./interfaces";

const initialState: IDepositEthModalState = {
  isOpen: false,
};

export const depositEthModalReducer: AppReducer<IDepositEthModalState> = (
  state = initialState,
  action,
): DeepReadonly<IDepositEthModalState> => {
  switch (action.type) {
    case "DEPOSIT_ETH_MODAL_SHOW":
      return {
        isOpen: true,
      };
    case "DEPOSIT_ETH_MODAL_HIDE":
      return {
        isOpen: false,
      };
    default:
      return state;
  }
};
