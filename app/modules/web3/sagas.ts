import { delay, END, eventChannel, Task } from "redux-saga";
import { call, cancel, fork, put, select, take } from "redux-saga/effects";

import { Web3Message } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import {
  LIGHT_WALLET_PASSWORD_CACHE_TIME,
  LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME,
} from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { LightWallet } from "../../lib/web3/LightWallet";
import { EWeb3ManagerEvents } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { selectUserType } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectWalletType } from "./selectors";
import { EWalletType } from "./types";

let lockWalletTask: Task | undefined;

export function* autoLockLightWallet({ web3Manager, logger }: TGlobalDependencies): Iterator<any> {
  logger.info(`Resetting light wallet password in ${LIGHT_WALLET_PASSWORD_CACHE_TIME} ms`);

  yield call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME);

  if (web3Manager.personalWallet) {
    logger.info("Resetting light wallet password now");
    yield put(actions.web3.walletLocked());
    (web3Manager.personalWallet as LightWallet).password = undefined;
  }
}

export function* autoClearWalletPrivateDataWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  logger.info(`Clearing wallet private data in ${LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME} ms`);

  yield call(delay, LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME);

  logger.info("Clearing wallet private data now");
  yield put(actions.web3.clearWalletPrivateDataFromState()); //Better to clear the seed here as well
}

export function* autoLockLightWalletWatcher(
  _deps: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
  if (
    action.type === "NEW_PERSONAL_WALLET_PLUGGED" &&
    action.payload.walletMetadata.walletType !== EWalletType.LIGHT
  ) {
    return;
  }
  lockWalletTask = yield neuCall(autoLockLightWallet);
}

export function* cancelLocking(): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
}

export function* loadPreviousWallet(
  { walletStorage }: TGlobalDependencies,
  forcedUserType?: EUserType,
): Iterator<any> {
  //forcedUserType can still pass as undefined
  const userType: EUserType = yield select(selectUserType);
  const storageData = walletStorage.get(forcedUserType || userType);
  if (storageData) {
    yield put(actions.web3.loadPreviousWallet(storageData));
  }
}

export function* personalWalletConnectionLost({ notificationCenter }: TGlobalDependencies): any {
  yield put(actions.walletSelector.reset());
  yield put(actions.walletSelector.ledgerReset());
  yield put(actions.web3.personalWalletDisconnected());

  const state: IAppState = yield select();

  const disconnectedWalletErrorMessage = () => {
    switch (selectWalletType(state.web3)) {
      case EWalletType.BROWSER:
        return createMessage(Web3Message.WEB3_ERROR_BROWSER);
      case EWalletType.LEDGER:
        return createMessage(Web3Message.WEB3_ERROR_LEDGER);
      default:
        return;
    }
  };

  const message = disconnectedWalletErrorMessage();

  if (message) {
    notificationCenter.error(message);
  }
}

interface IChannelTypes {
  type: EWeb3ManagerEvents;
  payload?: { isUnlocked: boolean; metaData: TWalletMetadata };
}

export function* initWeb3ManagerEvents({ web3Manager }: TGlobalDependencies): any {
  const channel = eventChannel<IChannelTypes>(emit => {
    web3Manager.on(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, payload =>
      emit({ type: EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, payload }),
    );

    web3Manager.on(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST, () =>
      emit({
        type: EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST,
      }),
    );

    return () => {
      web3Manager.removeAllListeners();
    };
  });

  while (true) {
    const event: IChannelTypes | END = yield take(channel);
    switch (event.type) {
      case EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED:
        yield put(
          actions.web3.newPersonalWalletPlugged(event.payload!.metaData, event.payload!.isUnlocked),
        );
        break;
      case EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST:
        yield put(actions.web3.personalWalletConnectionLost());
        break;
    }
  }
}

export const web3Sagas = function*(): Iterator<any> {
  yield fork(
    neuTakeEvery,
    ["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"],
    autoLockLightWalletWatcher,
  );
  yield fork(
    neuTakeEvery,
    ["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"],
    autoClearWalletPrivateDataWatcher,
  );
  yield fork(neuTakeEvery, ["PERSONAL_WALLET_DISCONNECTED", "WEB3_WALLET_LOCKED"], cancelLocking);
  yield fork(neuTakeEvery, "PERSONAL_WALLET_CONNECTION_LOST", personalWalletConnectionLost);
};
