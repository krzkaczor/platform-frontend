import { createAction, createActionFactory, createSimpleAction } from "../actionsUtils";
import { ETokenType } from "../tx/interfaces";
import { IStateLockedWallet } from "../wallet/interfaces";
import { IStateWalletMigrationData } from "./interfaces/WalletMigrationData";

export const icbmWalletBalanceModalActions = {
  // UX
  showIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SHOW"),
  hideIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_HIDE"),
  // Getters
  getWalletData: (icbmWalletEthAddress: string) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", { icbmWalletEthAddress }),
  //Setters
  loadIcbmWalletData: (data: IStateLockedWallet) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA", { data }),
  loadIcbmMigrationData: (walletMigrationData: IStateWalletMigrationData[]) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_LOAD_MIGRATION_DATA", {
      walletMigrationData,
    }),
  setFirstTxDone: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_FIRST_TRANSACTION_DONE"),
  setSecondTxDone: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SECOND_TRANSACTION_DONE"),
  setMigrationStepToNextStep: () =>
    createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SET_MIGRATION_STEP_TO_NEXT"),
  // Flow
  startMigrationFlow: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_START_MIGRATION"),
  downloadICBMWalletAgreement: createActionFactory(
    "ICBM_WALLET_BALANCE_MODAL_DOWNLOAD_AGREEMENT",
    (tokenType: ETokenType) => ({ tokenType }),
  ),
};
