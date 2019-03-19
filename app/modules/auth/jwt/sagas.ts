import { channel, delay } from "redux-saga";
import { call, Effect, put, select, take } from "redux-saga/effects";

import { TMessage } from "../../../components/translatedMessages/utils";
import { REDIRECT_CHANNEL_WATCH_DELAY } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { STORAGE_JWT_KEY } from "../../../lib/persistence/JwtObjectStorage";
import { IAppState } from "../../../store";
import { hasValidPermissions } from "../../../utils/JWTUtils";
import { accessWalletAndRunEffect } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { EInitType } from "../../init/reducer";
import { neuCall } from "../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../web3/selectors";
import { MessageSignCancelledError } from "../errors";
import { USER_JWT_KEY as USER_KEY } from "./../../../lib/persistence/UserStorage";

enum EUserAuthType {
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
}

/**
 * Saga & Promise to fetch a new jwt from the authentication server
 */

export function* loadJwt({ jwtStorage }: TGlobalDependencies): Iterator<Effect> {
  const jwt = jwtStorage.get();
  if (jwt) {
    yield put(actions.auth.loadJWT(jwt));
    return jwt;
  }
}

/**
 * Saga & Promise to fetch a new jwt from the authentication server
 */
export async function obtainJwtPromise(
  { web3Manager, signatureAuthApi, cryptoRandomString, logger }: TGlobalDependencies,
  state: IAppState,
  permissions: Array<string> = [],
): Promise<string> {
  const address = selectEthereumAddressWithChecksum(state);

  const salt = cryptoRandomString(64);
  if (!web3Manager.personalWallet) {
    throw new Error("Wallet unavailable Error");
  }
  const signerType = web3Manager.personalWallet.getSignerType();

  logger.info("Obtaining auth challenge from api");
  const {
    body: { challenge },
  } = await signatureAuthApi.challenge(address, salt, signerType, permissions);

  logger.info("Signing challenge");

  const signedChallenge = await web3Manager.personalWallet.signMessage(challenge);

  logger.info("Sending signed challenge back to api");

  const {
    body: { jwt },
  } = await signatureAuthApi.createJwt(challenge, signedChallenge, signerType);

  return jwt;
}

// see above
export function* obtainJWT(
  { jwtStorage }: TGlobalDependencies,
  permissions: Array<string> = [],
): Iterator<any> {
  const state: IAppState = yield select();
  const jwt: string = yield neuCall(obtainJwtPromise, state, permissions);
  yield put(actions.auth.loadJWT(jwt));
  jwtStorage.set(jwt);

  return jwt;
}

/**
 * Saga to ensure all the needed permissions are present and still valid
 * on the current jwt
 */
export function* ensurePermissionsArePresentAndRunEffect(
  { jwtStorage, logger }: TGlobalDependencies,
  effect: Iterator<any>,
  permissions: Array<string> = [],
  title: TMessage,
  message: TMessage,
): Iterator<any> {
  const jwt = jwtStorage.get();
  // check wether all permissions are present and still valid
  if (jwt && hasValidPermissions(jwt, permissions)) {
    yield effect;
    return;
  }
  // obtain a freshly signed token with missing permissions
  try {
    const obtainJwtEffect = neuCall(obtainJWT, permissions);
    yield call(accessWalletAndRunEffect, obtainJwtEffect, title, message);
    yield effect;
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      logger.info("Signing Cancelled");
    } else {
      throw new Error(error);
    }
  }
}

/**
 * Multi browser logout/login feature
 */

const redirectChannel = channel<{ type: EUserAuthType }>();

/**
 * Saga that starts an Event Channel Emitter that listens to storage
 * events from the browser
 */
export function* startRedirectChannel(): any {
  window.addEventListener("storage", (evt: StorageEvent) => {
    if (evt.key === STORAGE_JWT_KEY && evt.oldValue && !evt.newValue) {
      redirectChannel.put({
        type: EUserAuthType.LOGOUT,
      });
    }
    if (evt.key === USER_KEY && !evt.oldValue && evt.newValue) {
      redirectChannel.put({
        type: EUserAuthType.LOGIN,
      });
    }
  });
}

/**
 * Saga that watches events coming from redirectChannel and
 * dispatches login/logout actions
 */
export function* watchRedirectChannel(): any {
  yield startRedirectChannel();
  while (true) {
    const userAction = yield take(redirectChannel);
    switch (userAction.type) {
      case EUserAuthType.LOGOUT:
        yield put(actions.auth.logout());
        break;
      case EUserAuthType.LOGIN:
        yield put(actions.init.start(EInitType.APP_INIT));
        break;
    }
    yield delay(REDIRECT_CHANNEL_WATCH_DELAY);
  }
}
