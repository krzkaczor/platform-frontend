import * as promiseAll from "promise-all";
import { delay } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ICBMLockedAccount } from "../../lib/contracts/ICBMLockedAccount";
import { LockedAccount } from "../../lib/contracts/LockedAccount";
import { EthereumAddress, NumericString } from "../../types";
import { actions } from "../actions";
import { EInitType } from "../init/interfaces";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { neuCall, neuTakeEvery, neuTakeOnly, neuTakeUntil } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { IStateLockedWallet, IStateWalletData } from "./interfaces";

const WALLET_DATA_FETCHING_INTERVAL = 12000;

function* loadWalletDataSaga({ logger }: TGlobalDependencies): any {
  try {
    const ethAddress = yield select(selectEthereumAddressWithChecksum);
    yield put(actions.gas.gasApiEnsureLoading());
    yield take("GAS_API_LOADED");

    const state: IStateWalletData = yield neuCall(loadWalletDataAsync, ethAddress);
    yield put(actions.wallet.saveWalletData(state));
    logger.info("Wallet Loaded");
  } catch (e) {
    yield put(actions.wallet.loadWalletDataError("Error while loading wallet data."));
    logger.error("Error while loading wallet data: ", e);
  }
}

async function loadICBMWallet(
  ethAddress: EthereumAddress,
  lockedAccount?: ICBMLockedAccount | LockedAccount,
): Promise<IStateLockedWallet> {
  if (lockedAccount) {
    const balance = await lockedAccount.balanceOf(ethAddress);
    return {
      LockedBalance: balance[0].toString() as NumericString,
      neumarksDue: balance[1].toString() as NumericString,
      unlockDate: balance[2].toString(),
    };
  } else {
    // todo: may be removed when contracts deployed on production
    return {
      LockedBalance: "0" as NumericString,
      neumarksDue: "0" as NumericString,
      unlockDate: "0" as NumericString,
    };
  }
}

export async function loadWalletDataAsync(
  { contractsService, web3Manager }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<IStateWalletData> {
  return {
    ...(await promiseAll({
      euroTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEuroLock),
      etherTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEtherLock),
      euroTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.euroLock),
      etherTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.etherLock),
      etherTokenUpgradeTarget: contractsService.icbmEtherLock.currentMigrationTarget,
      euroTokenUpgradeTarget: contractsService.icbmEuroLock.currentMigrationTarget,
      etherTokenBalance: contractsService.etherToken
        .balanceOf(ethAddress)
        .then(v => v.toString() as NumericString),
      euroTokenBalance: contractsService.euroToken
        .balanceOf(ethAddress)
        .then(v => v.toString() as NumericString),
      etherBalance: web3Manager.internalWeb3Adapter
        .getBalance(ethAddress)
        .then(v => v.toString() as NumericString),
      neuBalance: contractsService.neumark
        .balanceOf(ethAddress)
        .then(v => v.toString() as NumericString),
    })),
  };
}

function* walletBalanceWatcher(): any {
  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractsInitialized) {
    yield neuTakeOnly("INIT_DONE", { initType: EInitType.START_CONTRACTS_INIT });
  }

  while (true) {
    yield neuCall(loadWalletDataSaga);
    yield delay(WALLET_DATA_FETCHING_INTERVAL);
  }
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_LOAD_WALLET_DATA", loadWalletDataSaga);
  yield neuTakeUntil("AUTH_SET_USER", "AUTH_LOGOUT", walletBalanceWatcher);
}
