import { TMessage } from "../../../components/translatedMessages/utils";

export interface ILedgerAccount {
  address: string;
  derivationPath: string;
  balanceETH: string;
  balanceNEU: string;
}

export interface ILedgerWizardState {
  isInitialConnectionInProgress: boolean;
  isConnectionEstablished: boolean;
  errorMsg?: TMessage;
  isLoadingAddresses: boolean;
  derivationPathPrefix: string; // TODO: it can be optional, not required for advanced - false
  index: number; // TODO: it can be optional, not required for advanced - false
  numberOfAccountsPerPage: number; // TODO: it can be optional, not required for advanced - false
  accounts: ILedgerAccount[];
  advanced: boolean;
}
