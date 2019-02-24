import { IStateLockedWallet } from "../../wallet/interfaces";
import { IStateWalletMigrationData } from "./WalletMigrationData";

export type TWalletMigrationSteps = 1 | 2; //todo enum

export interface IStateIcbmWalletBalanceModal {
  isOpen: boolean;
  loading: boolean;
  icbmWalletEthAddress?: string;
  icbmLockedEthWallet?: IStateLockedWallet;
  walletMigrationData: IStateWalletMigrationData[];
  currentMigrationStep: TWalletMigrationSteps;
  isMigrating: boolean;
  firstTransactionDone: boolean;
  secondTransactionDone: boolean;
}
