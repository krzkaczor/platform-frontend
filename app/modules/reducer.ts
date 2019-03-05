import { portfolioDownloadAgreementsModalReducer } from "../components/portfolio/reducer";
import { accessWalletReducer } from "./access-wallet/reducer";
import { authReducer } from "./auth/reducer";
import { bankTransferFlowReducer } from "./bank-transfer-flow/reducer";
import { bookBuildingFlowReducer } from "./bookbuilding-flow/reducer";
import { contractsReducer } from "./contracts/reducer";
import { depositEthModalReducer } from "./deposit-eth-modal/reducer";
import { etoDocumentReducer } from "./eto-documents/reducer";
import { etoFlowReducer } from "./eto-flow/reducer";
import { gasReducer } from "./gas/reducer";
import { genericModalReducer } from "./generic-modal/reducer";
import { icbmWalletBalanceModalReducer } from "./icbm-wallet-balance-modal/reducer";
import { immutableStorageReducer } from "./immutable-file/reducer";
import { initReducer } from "./init/reducer";
import { investmentFlowReducer } from "./investment-flow/reducer";
import { investorTicketsReducer } from "./investor-portfolio/reducer";
import { kycReducer } from "./kyc/reducer";
import { moneyReducer } from "./money/reducer";
import { notificationsReducer } from "./notifications/reducer";
import { personProfileModalReducer } from "./person-profile-modal/reducer";
import { profileReducer } from "./profile/reducer";
import { publicEtosReducer } from "./public-etos/reducer";
import { tokenPriceReducer } from "./shared/tokenPrice/reducer";
import { txMonitorReducer } from "./tx/monitor/reducer";
import { txSenderReducer } from "./tx/sender/reducer";
import { browserReducer } from "./user-agent/reducer";
import { verifyEmailWidgetReducer } from "./verify-email-widget/reducer";
import { videoModalReducer } from "./video-modal/reducer";
import { browserWalletWizardReducer } from "./wallet-selector/browser-wizard/reducer";
import { ledgerWizardReducer } from "./wallet-selector/ledger-wizard/reducer";
import { lightWalletWizardReducer } from "./wallet-selector/light-wizard/reducer";
import { walletSelectorReducer } from "./wallet-selector/reducer";
import { walletReducer } from "./wallet/reducer";
import { web3Reducer } from "./web3/reducer";

// add new app reducers here. They must be AppReducer<T> type
export const appReducers = {
  bankTransferFLow: bankTransferFlowReducer,
  contracts: contractsReducer,
  ledgerWizardState: ledgerWizardReducer,
  verifyEmailWidgetState: verifyEmailWidgetReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  web3: web3Reducer,
  browser: browserReducer,
  walletSelector: walletSelectorReducer,
  auth: authReducer,
  genericModal: genericModalReducer,
  accessWallet: accessWalletReducer,
  kyc: kycReducer,
  profile: profileReducer,
  investorTickets: investorTicketsReducer,
  tokenPrice: tokenPriceReducer,
  init: initReducer,
  lightWalletWizard: lightWalletWizardReducer,
  money: moneyReducer,
  wallet: walletReducer,
  notifications: notificationsReducer,
  etoFlow: etoFlowReducer,
  bookBuildingFlow: bookBuildingFlowReducer,
  etoDocuments: etoDocumentReducer,
  publicEtos: publicEtosReducer,
  depositEthModal: depositEthModalReducer,
  txSender: txSenderReducer,
  icbmWalletBalanceModal: icbmWalletBalanceModalReducer,
  gas: gasReducer,
  txMonitor: txMonitorReducer,
  investmentFlow: investmentFlowReducer,
  videoModal: videoModalReducer,
  personProfileModal: personProfileModalReducer,
  portfolioDownloadAgreementsModal: portfolioDownloadAgreementsModalReducer,
  immutableStorage: immutableStorageReducer,
};
