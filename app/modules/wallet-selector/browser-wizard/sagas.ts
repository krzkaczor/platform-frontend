import { fork, put, select, cancel, take, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/BrowserWallet";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "../../../config/constants";

export function* browserWalletConnectionWatcher(): any {
  yield fork(neuCall, tryConnectingWithBrowserWallet);

  const connectionRetry = yield takeLatest(
    "BROWSER_WALLET_CONNECTION_ERROR",
    neuCall, tryConnectingWithBrowserWallet,
    BROWSER_WALLET_RECONNECT_INTERVAL
  );
  yield take(["@@router/LOCATION_CHANGE","WALLET_SELECTOR_CONNECTED"]);
  yield cancel(connectionRetry);
  yield cancel()
}


export function* tryConnectingWithBrowserWallet(
  {
    browserWalletConnector,
    web3Manager,
    logger,
  }: TGlobalDependencies,
  timeout?: number
): any {
  const state: IAppState = yield select();
  if(timeout){
    yield delay(timeout)
  }
  yield console.log("after delay")
  if (!state.browserWalletWizardState.approvalRejected) {
    try {
      yield console.log("trying")
      const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
        web3Manager.networkId,
      );
      yield console.log("browserWallet", browserWallet)
      const r = yield web3Manager.plugPersonalWallet(browserWallet);
      yield console.log("connect", r)
      yield put(actions.walletSelector.connected());
    } catch (e) {
      yield console.log("catching", e)
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
