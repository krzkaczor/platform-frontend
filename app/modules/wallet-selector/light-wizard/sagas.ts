import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import {
  BackupRecoveryMessage,
  GenericErrorMessage,
  GenericModalMessage,
  SignInUserErrorMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EmailAlreadyExists, UserNotExisting } from "../../../lib/api/users/UsersApi";
import {
  ILightWalletMetadata,
  ILightWalletRetrieveMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
  LightWalletUtil,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TAction } from "../../actions";
import { IApiUserInput, IStateUser } from "../../auth/interfaces";
import { obtainJWT } from "../../auth/jwt/sagas";
import {
  createUser,
  loadUser,
  loadUserPromise,
  signInUser,
  updateUser,
  updateUserPromise,
} from "../../auth/user/sagas";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { EWalletSubType, EWalletType } from "../../web3/interfaces";
import {
  selectIsUnlocked,
  selectLightWalletFromQueryString,
  selectPreviousConnectedWallet,
} from "../../web3/selectors";
import { selectUrlUserType } from "../selectors";
import { mapLightWalletErrorToErrorMessage } from "./errors";

//Vault nonce should be exactly 24 chars
const VAULT_MSG = "pleaseallowmetointroducemyselfim";
const GENERATED_KEY_SIZE = 56;
export const DEFAULT_HD_PATH = "m/44'/60'/0'";

export async function getVaultKey(
  lightWalletUtil: LightWalletUtil,
  salt: string,
  password: string,
): Promise<string> {
  const walletKey = await lightWalletUtil.getWalletKeyFromSaltAndPassword(
    password,
    salt,
    GENERATED_KEY_SIZE,
  );
  return lightWalletUtil.encryptString({
    string: VAULT_MSG,
    pwDerivedKey: walletKey,
  });
}

export async function retrieveMetadataFromVaultAPI(
  { lightWalletUtil, vaultApi }: TGlobalDependencies,
  password: string,
  salt: string,
  email: string,
): Promise<ILightWalletRetrieveMetadata> {
  const vaultKey = await getVaultKey(lightWalletUtil, salt, password);
  try {
    const vault = await vaultApi.retrieve(vaultKey);

    return {
      walletType: EWalletType.LIGHT,
      salt,
      vault,
      email,
    };
  } catch {
    throw new LightWalletWrongPassword();
  }
}

export function* getWalletMetadata(
  _: TGlobalDependencies,
  password: string,
): Iterator<any | ILightWalletRetrieveMetadata | undefined> {
  const queryStringWalletInfo: { email: string; salt: string } | undefined = yield select(
    (s: IAppState) => selectLightWalletFromQueryString(s.router),
  );
  if (queryStringWalletInfo) {
    return yield neuCall(
      retrieveMetadataFromVaultAPI,
      password,
      queryStringWalletInfo.salt,
      queryStringWalletInfo.email,
    );
  }
  const savedMetadata = yield effects.select((s: IAppState) =>
    selectPreviousConnectedWallet(s.web3),
  );
  if (savedMetadata && savedMetadata.walletType === EWalletType.LIGHT) {
    return savedMetadata;
  }

  return undefined;
}

export async function setupLightWalletPromise(
  { lightWalletUtil, vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed: string,
): Promise<ILightWalletMetadata> {
  try {
    const lightWalletVault = await lightWalletUtil.createLightWalletVault({
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });
    const walletInstance = await lightWalletUtil.deserializeLightWalletVault(
      lightWalletVault.walletInstance,
      lightWalletVault.salt,
    );

    const vaultKey = await getVaultKey(lightWalletUtil, lightWalletVault.salt, password);
    await vaultApi.store(vaultKey, lightWalletVault.walletInstance);

    const lightWallet = await lightWalletConnector.connect(
      {
        walletInstance,
        salt: lightWalletVault.salt,
      },
      email,
      password,
    );

    await web3Manager.plugPersonalWallet(lightWallet);
    return lightWallet.getMetadata() as ILightWalletMetadata;
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e);
    throw e;
  }
}

export function* lightWalletRegisterWatch(
  { logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  try {
    if (action.type !== "LIGHT_WALLET_REGISTER") return;

    const { password, email } = action.payload;
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);

    if (!isEmailAvailable) {
      throw new EmailAlreadyExists();
    }
    yield neuCall(setupLightWalletPromise, email, password);
    yield neuCall(signInUser);
  } catch (e) {
    yield effects.put(actions.walletSelector.reset());

    let error;
    if (e instanceof EmailAlreadyExists) {
      error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
    } else if (e instanceof LightError) {
      logger.error("Light wallet recovery error", e);
      error = mapLightWalletErrorToErrorMessage(e);
    } else {
      error = createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE);
    }

    yield put(
      actions.genericModal.showErrorModal(createMessage(GenericModalMessage.ERROR_TITLE), error),
    );
  }
}

async function checkEmailPromise(
  { apiUserService }: TGlobalDependencies,
  email: string,
): Promise<boolean> {
  const emailStatus = await apiUserService.emailStatus(email);
  return emailStatus.isAvailable;
}

export function* lightWalletRecoverWatch(
  { logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  try {
    const userType = yield select((state: IAppState) => selectUrlUserType(state.router));

    if (action.type !== "LIGHT_WALLET_RECOVER") {
      return;
    }
    const { password, email, seed } = action.payload;

    const walletMetadata = yield neuCall(setupLightWalletPromise, email, password, seed, userType);

    yield put(actions.walletSelector.messageSigning());
    yield neuCall(obtainJWT, [EJwtPermissions.CHANGE_EMAIL_PERMISSION]);
    const userUpdate: IApiUserInput = {
      salt: walletMetadata.salt,
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    };
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);
    try {
      const user: IStateUser = yield neuCall(loadUserPromise);
      if (isEmailAvailable) {
        userUpdate.newEmail = walletMetadata.email;
        yield effects.call(updateUser, userUpdate);
      } else {
        if (user.verifiedEmail === email.toLowerCase()) yield effects.call(updateUser, userUpdate);
        else {
          throw new EmailAlreadyExists();
        }
      }
    } catch (e) {
      if (e instanceof UserNotExisting) {
        if (!isEmailAvailable) {
          throw new EmailAlreadyExists();
        }
        userUpdate.newEmail = walletMetadata.email;
        yield effects.call(createUser, userUpdate);
      } else throw e;
    }
    yield put(actions.routing.goToSuccessfulRecovery());
  } catch (e) {
    yield effects.put(actions.walletSelector.reset());

    let error;
    if (e instanceof EmailAlreadyExists) {
      error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
    } else if (e instanceof LightError) {
      logger.error("Light wallet recovery error", e);
      error = mapLightWalletErrorToErrorMessage(e);
    } else {
      error = createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE);
    }

    yield put(
      actions.genericModal.showErrorModal(createMessage(GenericModalMessage.ERROR_TITLE), error),
    );
  }
}

export function* lightWalletBackupWatch({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const user = yield select((state: IAppState) => state.auth.user);
    yield neuCall(updateUserPromise, { ...user, backupCodesVerified: true });
    yield call(
      displayInfoModalSaga,
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_TITLE),
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_DESCRIPTION),
    );
    yield loadUser();
    yield effects.put(actions.routing.goToProfile());
  } catch (e) {
    logger.error("Light Wallet Backup Error", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadPrivateDataFromWallet({ web3Manager }: TGlobalDependencies): Iterator<any> {
  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3));
  if (!isUnlocked) {
    throw new LightWalletLocked();
  }
  try {
    const lightWallet = web3Manager.personalWallet as LightWallet;
    const { seed, privateKey } = yield call(lightWallet.getWalletPrivateData.bind(lightWallet));
    yield put(actions.web3.loadWalletPrivateDataToState(seed, privateKey));
  } catch (e) {
    throw new Error("Fetching seed failed");
  }
}

export function* loadSeedFromWalletWatch({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(loadPrivateDataFromWallet);
  } catch (e) {
    logger.error("Load seed from wallet", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletLoginWatch(
  { web3Manager, lightWalletConnector, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "LIGHT_WALLET_LOGIN") {
    return;
  }
  const { password } = action.payload;

  try {
    const walletMetadata: ILightWalletRetrieveMetadata | undefined = yield neuCall(
      getWalletMetadata,
      password,
    );

    if (!walletMetadata) {
      invariant(walletMetadata, "Missing metadata");
      return;
    }
    const wallet: LightWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );
    const isValidPassword: boolean = yield LightWalletUtil.testWalletPassword(
      wallet.vault.walletInstance,
      password,
    );
    if (!isValidPassword) {
      throw new LightWalletWrongPassword();
    }

    yield web3Manager.plugPersonalWallet(wallet);
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield effects.put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "LIGHT_WALLET_LOGIN", lightWalletLoginWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_REGISTER", lightWalletRegisterWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_BACKUP", lightWalletBackupWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_RECOVER", lightWalletRecoverWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
