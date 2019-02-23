import BigNumber from "bignumber.js";

import {convert} from "../../components/eto/utils";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import {
  IStateIcbmWalletBalanceModal,
  TWalletMigrationSteps
} from "./interfaces/intefaces";
import * as walletMigrationDataInterfaces from './interfaces/WalletMigrationData'

// ICBM Wallet Selectors
export const selectIcbmWalletEthAddress = (state: IAppState): string | undefined =>
  state.icbmWalletBalanceModal.icbmWalletEthAddress;

export const selectEtherNeumarksDueIcbmModal = (state: IAppState): BigNumber =>
  new BigNumber((state.icbmWalletBalanceModal.icbmLockedEthWallet &&
    state.icbmWalletBalanceModal.icbmLockedEthWallet.neumarksDue) ||
  "0");

export const selectEtherBalanceIcbmModal = (state: IAppState): BigNumber =>
  new BigNumber((state.icbmWalletBalanceModal.icbmLockedEthWallet &&
    state.icbmWalletBalanceModal.icbmLockedEthWallet.LockedBalance) ||
  "0");

// Migration Tool Selectors
export const selectWalletMigrationData = (
  state: DeepReadonly<IStateIcbmWalletBalanceModal>,
): ReadonlyArray<walletMigrationDataInterfaces.IBlWalletMigrationData> | undefined =>
  state.walletMigrationData.map(x => convert(x, walletMigrationDataInterfaces.stateToBlConversionSpec));

export const selectWalletMigrationCurrentStep = (state: IAppState): TWalletMigrationSteps =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.currentMigrationStep;

export const selectIcbmModalIsMigrating = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.isMigrating;

export const selectIcbmModalIsFirstTransactionDone = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.firstTransactionDone;

export const selectIcbmModalIsSecondTransactionDone = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.secondTransactionDone;
