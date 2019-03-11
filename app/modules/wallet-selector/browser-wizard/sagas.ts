import { delay } from "redux-saga";
import { cancel, fork, put, select, take, takeLatest } from "redux-saga/effects";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/BrowserWallet";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

export function* browserWalletConnectionWatcher(): any {
  yield fork(neuCall, tryConnectingWithBrowserWallet);

  const connectionRetry = yield takeLatest(
    "BROWSER_WALLET_CONNECTION_ERROR",
    neuCall,
    tryConnectingWithBrowserWallet,
    BROWSER_WALLET_RECONNECT_INTERVAL,
  );
  yield take(["@@router/LOCATION_CHANGE", "WALLET_SELECTOR_CONNECTED"]);
  yield cancel(connectionRetry);
  yield cancel();
}

export function* tryConnectingWithBrowserWallet(
  { browserWalletConnector, web3Manager, logger }: TGlobalDependencies,
  timeout?: number,
): any {
  const state: IAppState = yield select();
  if (timeout) {
    yield delay(timeout);
  }
  if (!state.browserWalletWizardState.approvalRejected) {
    try {
      const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
        web3Manager.networkId,
      );
      yield web3Manager.plugPersonalWallet(browserWallet);
      yield put(actions.walletSelector.connected());
    } catch (e) {
      if (e instanceof BrowserWalletAccountApprovalRejectedError) {
        yield put(actions.walletSelector.browserWalletAccountApprovalRejectedError());
      } else {
        const error = mapBrowserWalletErrorToErrorMessage(e);
        yield put(actions.walletSelector.browserWalletConnectionError(error));
        if (error.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
          logger.error("Error while trying to connect with browser wallet", e);
        }
      }
    }
  }
}

export function* browserWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "BROWSER_WALLET_TRY_CONNECTING", browserWalletConnectionWatcher);
}
