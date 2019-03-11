import { Effect, fork, put, select } from "redux-saga/effects";

import { SignInUserErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { SignerRejectConfirmationError, SignerTimeoutError } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { EInitType } from "../init/reducer";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { selectActivationCodeFromQueryString, selectEmailFromQueryString } from "../web3/selectors";
import { verifyUserEmailPromise } from "./email/sagas";
import { watchRedirectChannel } from "./jwt/sagas";
import { selectUserEmail, selectVerifiedUserEmail } from "./selectors";
import { loadUser, signInUser } from "./user/sagas";

function* logoutWatcher(
  { web3Manager, jwtStorage, logger, userStorage }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "AUTH_LOGOUT") return;
  const { userType, disableRedirect } = action.payload;

  userStorage.clear();
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
  yield put(actions.web3.personalWalletDisconnected());
  if (!disableRedirect) {
    if (userType === EUserType.INVESTOR || !userType) {
      yield put(actions.routing.goHome());
    } else {
      yield put(actions.routing.goEtoHome());
    }
  }
  yield put(actions.init.start(EInitType.APP_INIT));
  logger.setUser(null);
}

function* setUser({ logger }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "AUTH_SET_USER") return;

  const user = action.payload.user;
  logger.setUser({ id: user.userId, type: user.type, walletType: user.walletType });
}

function* handleSignInUser({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("User Sign in error", e);

    if (e instanceof SignerRejectConfirmationError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED),
        ),
      );
    } else if (e instanceof SignerTimeoutError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT),
        ),
      );
    } else {
      yield put(actions.auth.logout(undefined, false));
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE),
        ),
      );
    }
  }
}

/**
 * Email Verification
 */
function* verifyUserEmail(): Iterator<any> {
  const userCode = yield select((s: IAppState) => selectActivationCodeFromQueryString(s.router));
  const urlEmail = yield select((s: IAppState) => selectEmailFromQueryString(s.router));
  const userEmail = yield select((s: IAppState) => selectUserEmail(s.auth));

  if (userEmail && userEmail !== urlEmail) {
    // Logout if there is different user session active
    yield put(actions.auth.logout(undefined, true));
    return;
  }
  const verifiedEmail = yield select((s: IAppState) => selectVerifiedUserEmail(s.auth));

  yield neuCall(verifyUserEmailPromise, userCode, urlEmail, verifiedEmail);
  yield loadUser();
  yield put(actions.routing.goToProfile());
}

export const authSagas = function*(): Iterator<Effect> {
  yield fork(watchRedirectChannel);
  yield fork(neuTakeLatest, "AUTH_LOGOUT", logoutWatcher);
  yield fork(neuTakeEvery, "AUTH_SET_USER", setUser);
  yield fork(neuTakeEvery, "AUTH_VERIFY_EMAIL", verifyUserEmail);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", handleSignInUser);
};
