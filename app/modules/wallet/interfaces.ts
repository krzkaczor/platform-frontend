import { NumericString } from "../../types";

export interface IStateWallet {
  loading: boolean;
  error?: string;
  data?: IStateWalletData;
}

export interface IStateLockedWallet {
  LockedBalance: NumericString;
  neumarksDue: NumericString;
  unlockDate: string;
}

export interface IStateWalletData {
  euroTokenLockedWallet: IStateLockedWallet;
  etherTokenLockedWallet: IStateLockedWallet;

  etherTokenBalance: NumericString;
  euroTokenBalance: NumericString;
  etherBalance: NumericString;
  neuBalance: NumericString;

  euroTokenICBMLockedWallet: IStateLockedWallet;
  etherTokenICBMLockedWallet: IStateLockedWallet;
  etherTokenUpgradeTarget?: string;
  euroTokenUpgradeTarget?: string;
}
