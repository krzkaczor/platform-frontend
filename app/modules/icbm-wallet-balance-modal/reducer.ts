import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateIcbmWalletBalanceModal } from "./interfaces/intefaces";

const initialState: IStateIcbmWalletBalanceModal = {
  isOpen: false,
  loading: false,
  isMigrating: false,
  firstTransactionDone: false,
  secondTransactionDone: false,
  currentMigrationStep: 1,
  walletMigrationData: [],
};

export const icbmWalletBalanceModalReducer: AppReducer<IStateIcbmWalletBalanceModal> = (
  state = initialState,
  action,
): DeepReadonly<IStateIcbmWalletBalanceModal> => {
  switch (action.type) {
    case "ICBM_WALLET_BALANCE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_HIDE":
      return {
        ...initialState,
        isOpen: false,
      };
    case "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA":
      return {
        ...state,
        icbmWalletEthAddress: action.payload.icbmWalletEthAddress,
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA":
      return {
        ...state,
        loading: false,
        icbmLockedEthWallet: action.payload.data,
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_MIGRATION_DATA":
      return {
        ...state,
        loading: false,
        walletMigrationData: action.payload.walletMigrationData,
      };
    case "ICBM_WALLET_BALANCE_MODAL_START_MIGRATION":
      return {
        ...state,
        isMigrating: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_FIRST_TRANSACTION_DONE":
      return {
        ...state,
        firstTransactionDone: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_SECOND_TRANSACTION_DONE":
      return {
        ...state,
        secondTransactionDone: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_SET_MIGRATION_STEP_TO_NEXT":
      return {
        ...state,
        currentMigrationStep: 2,
      };
    default:
      return state;
  }
};
