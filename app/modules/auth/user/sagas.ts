import { call, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserType, IUser, IUserInput } from "../../../lib/api/users/interfaces";
import { UserNotExisting } from "../../../lib/api/users/UsersApi";
import { REGISTRATION_LOGIN_DONE } from "../../../lib/persistence/UserStorage";
import { SignerRejectConfirmationError } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { loadKycRequestData } from "../../kyc/sagas";
import { selectRedirectURLFromQueryString } from "../../routing/selectors";
import { neuCall } from "../../sagasUtils";
import { selectUrlUserType } from "../../wallet-selector/selectors";
import { loadPreviousWallet } from "../../web3/sagas";
import { EWalletSubType, EWalletType } from "../../web3/types";
import { obtainJWT } from "../jwt/sagas";
import { selectUserType } from "../selectors";
import { EJwtPermissions } from "./../../../config/constants";
import { SignerTimeoutError, SignerUnknownError } from "./../../../lib/web3/Web3Manager";

export function* signInUser({
  walletStorage,
  web3Manager,
  userStorage,
}: TGlobalDependencies): Iterator<any> {
  try {
    // we will try to create with user type from URL but it could happen that account already exists and has different user type
    const probableUserType: EUserType = yield select((s: IAppState) => selectUrlUserType(s.router));
    yield put(actions.walletSelector.messageSigning());

    yield neuCall(obtainJWT, [EJwtPermissions.SIGN_TOS]); // by default we have the sign-tos permission, as this is the first thing a user will have to do after signup
    yield call(loadOrCreateUser, probableUserType);

    const userType: EUserType = yield select(selectUserType);
    // tslint:disable-next-line
    walletStorage.set(web3Manager.personalWallet!.getMetadata(), userType);

    const redirectionUrl = yield select((state: IAppState) =>
      selectRedirectURLFromQueryString(state.router),
    );

    // For other open browser pages
    yield userStorage.set(REGISTRATION_LOGIN_DONE);

    if (redirectionUrl) {
      yield put(actions.routing.goTo(redirectionUrl));
    } else {
      yield put(actions.routing.goToDashboard());
    }
  } catch (e) {
    if (e instanceof SignerRejectConfirmationError || e instanceof SignerTimeoutError) {
      throw e;
    } else {
      throw new SignerUnknownError();
    }
  }
}

export function* loadUser(): Iterator<any> {
  const user: IUser = yield neuCall(loadUserPromise);
  yield neuCall(loadPreviousWallet, user.type);
  yield put(actions.auth.setUser(user));
  yield neuCall(loadKycRequestData);
}

export async function loadUserPromise({ apiUserService }: TGlobalDependencies): Promise<IUser> {
  return await apiUserService.me();
}

export async function createUserPromise(
  { apiUserService }: TGlobalDependencies,
  user: IUserInput,
): Promise<IUser> {
  return apiUserService.createAccount(user);
}

export function* createUser(newUser: IUserInput): Iterator<any> {
  const user: IUser = yield neuCall(createUserPromise, newUser);
  yield put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export async function updateUserPromise(
  { apiUserService }: TGlobalDependencies,
  user: IUserInput,
): Promise<IUser> {
  return apiUserService.updateUser(user);
}
// TODO: Remove updateUserPromise

export function* loadOrCreateUser(userType: EUserType): Iterator<any> {
  const user: IUser = yield neuCall(loadOrCreateUserPromise, userType);
  yield put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export function* updateUser(updatedUser: IUserInput): Iterator<any> {
  const user: IUser = yield neuCall(updateUserPromise, updatedUser);
  yield put(actions.auth.setUser(user));
}

export async function loadOrCreateUserPromise(
  { apiUserService, web3Manager }: TGlobalDependencies,
  userType: EUserType,
): Promise<IUser> {
  // tslint:disable-next-line
  const walletMetadata = web3Manager.personalWallet!.getMetadata();
  try {
    const user = await apiUserService.me();
    if (
      user.walletType === walletMetadata.walletType &&
      user.walletSubtype === walletMetadata.walletSubType
    ) {
      return user;
    }
    // if wallet type changed send correct wallet type to the backend
    user.walletType = walletMetadata.walletType;
    user.walletSubtype = walletMetadata.walletSubType;
    return await apiUserService.updateUser(user);
  } catch (e) {
    if (!(e instanceof UserNotExisting)) {
      throw e;
    }
  }
  // for light wallet we need to send slightly different request
  if (walletMetadata && walletMetadata.walletType === EWalletType.LIGHT) {
    return apiUserService.createAccount({
      newEmail: walletMetadata.email,
      salt: walletMetadata.salt,
      backupCodesVerified: false,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    });
  } else {
    return apiUserService.createAccount({
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype:
        walletMetadata.walletType === EWalletType.BROWSER
          ? walletMetadata.walletSubType
          : EWalletSubType.UNKNOWN,
    });
  }
}
