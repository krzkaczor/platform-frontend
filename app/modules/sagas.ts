import { effects } from "redux-saga";
import { getContext } from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { authSagas } from "./auth/sagas";
import { bankTransferFlowSaga } from "./bank-transfer-flow/sagas";
import { bookBuildingFlowSagas } from "./bookbuilding-flow/sagas";
import { etoDocumentsSagas } from "./eto-documents/sagas";
import { etoFlowSagas } from "./eto-flow/sagas";
import { gasApiSagas } from "./gas/sagas";
import { icbmWalletGetDataSagas } from "./icbm-wallet-balance-modal/sagas";
import { immutableFileSagas } from "./immutable-file/sagas";
import { initSagas } from "./init/sagas";
import { investmentFlowSagas } from "./investment-flow/sagas";
import { investorTicketsSagas } from "./investor-portfolio/sagas";
import { kycSagas } from "./kyc/sagas";
import { profileSagas } from "./profile/sagas";
import { etoSagas } from "./public-etos/sagas";
import { routingSagas } from "./routing/sagas";
import { neuRestartIf } from "./sagasUtils";
import { formSingleFileUploadSagas } from "./shared/formSingleFileUpload/sagas";
import { remoteFileSagas } from "./shared/remoteFile/sagas";
import { tokenPriceSagas } from "./shared/tokenPrice/sagas";
import { termsOfServiceSagas } from "./terms-of-service-modal/sagas";
import { txMonitorSagas } from "./tx/monitor/sagas";
import { txTransactionsSagasWatcher } from "./tx/transactions/sagas";
import { txValidatorSagasWatcher } from "./tx/validator/sagas";
import { browserWalletSagas } from "./wallet-selector/browser-wizard/sagas";
import { ledgerSagas } from "./wallet-selector/ledger-wizard/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { walletSagas } from "./wallet/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(initSagas),
    effects.fork(authSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(lightWalletSagas),
    effects.fork(browserWalletSagas),
    effects.fork(ledgerSagas),
    effects.fork(routingSagas),
    // Sagas that should be restarted immediately when logout occurs
    effects.fork(neuRestartIf, "AUTH_LOGOUT", termsOfServiceSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", bankTransferFlowSaga),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", kycSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", investorTicketsSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", profileSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", web3Sagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", walletSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", icbmWalletGetDataSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", etoFlowSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", immutableFileSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", etoSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", bookBuildingFlowSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", formSingleFileUploadSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", remoteFileSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", txValidatorSagasWatcher),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", txTransactionsSagasWatcher),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", gasApiSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", etoDocumentsSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", txMonitorSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", tokenPriceSagas),
    effects.fork(neuRestartIf, "AUTH_LOGOUT", investmentFlowSagas),
  ]);
}

function* handleRootError(error: Error): Iterator<effects.Effect> {
  const { logger }: TGlobalDependencies = yield getContext("deps");

  logger.error(error);
}

export function* rootSaga(): Iterator<effects.Effect> {
  while (true) {
    try {
      yield effects.call(allSagas);
    } catch (e) {
      yield effects.call(handleRootError, e);
    }
  }
}
