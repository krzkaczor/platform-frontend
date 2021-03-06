import { TMessage } from "../../../components/translatedMessages/utils";
import { createAction, createSimpleAction } from "../../actionsUtils";
import { ILedgerAccount } from "./reducer";

export const LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS = ["44'/60'/1'/0", "44'/60'/0'/0"]; // TODO this should be taken from config

export const ledgerWizardActions = {
  ledgerTryEstablishingConnectionWithLedger: () =>
    createSimpleAction("LEDGER_TRY_ESTABLISHING_CONNECTION"),

  ledgerLoadAccounts: () => createSimpleAction("LEDGER_LOAD_ACCOUNTS"),

  ledgerSetDerivationPathPrefix: (derivationPathPrefix: string) =>
    createAction("LEDGER_SET_DERIVATION_PATH_PREFIX", { derivationPathPrefix }),

  ledgerGoToNextPageAndLoadData: () => createSimpleAction("LEDGER_GO_TO_NEXT_PAGE_AND_LOAD_DATA"),

  ledgerGoToPreviousPageAndLoadData: () =>
    createSimpleAction("LEDGER_GO_TO_PREVIOUS_PAGE_AND_LOAD_DATA"),

  ledgerFinishSettingUpLedgerConnector: (derivationPath: string) =>
    createAction("LEDGER_FINISH_SETTING_UP_LEDGER_CONNECTOR", { derivationPath }),

  ledgerVerifyIfLedgerStillConnected: () =>
    createSimpleAction("LEDGER_VERIFY_IF_LEDGER_STILL_CONNECTED"),

  ledgerWizardAccountsListNextPage: () =>
    createSimpleAction("LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE"),

  ledgerWizardAccountsListPreviousPage: () =>
    createSimpleAction("LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE"),

  ledgerConnectionEstablished: () => createSimpleAction("LEDGER_CONNECTION_ESTABLISHED"),

  ledgerConnectionEstablishedError: (errorMsg: TMessage) =>
    createAction("LEDGER_CONNECTION_ESTABLISHED_ERROR", { errorMsg }),

  setLedgerWizardDerivationPathPrefix: (derivationPathPrefix: string) =>
    createAction("SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX", { derivationPathPrefix }),

  ledgerWizardDerivationPathPrefixError: () =>
    createSimpleAction("LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR"),

  toggleLedgerAccountsAdvanced: () => createSimpleAction("TOGGLE_LEDGER_WIZARD_ADVANCED"),

  setLedgerAccounts: (accounts: ILedgerAccount[], derivationPathPrefix: string) =>
    createAction("SET_LEDGER_WIZARD_ACCOUNTS", { accounts, derivationPathPrefix }),

  ledgerReset: () => createSimpleAction("LEDGER_WIZARD_RESET"),
};
