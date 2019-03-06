import { call, fork, put, select } from "redux-saga/effects";

import { ProfileMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EmailAlreadyExists } from "../../lib/api/users/UsersApi";
import { IAppState } from "../../store";
import { accessWalletAndRunEffect } from "../access-wallet/sagas";
import { actions, TActionFromCreator } from "../actions";
import { MessageSignCancelledError } from "../auth/errors";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import {
  selectDoesEmailExist,
  selectUnverifiedUserEmail,
  selectUser,
  selectVerifiedUserEmail,
} from "../auth/selectors";
import { updateUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectLightWalletSalt } from "../web3/selectors";

function* addNewEmailEffect(
  { notificationCenter, logger }: TGlobalDependencies,
  email: string,
): any {
  const user = yield select((s: IAppState) => selectUser(s.auth));
  const salt = yield select(selectLightWalletSalt);
  logger.info("New Email added");
  yield call(updateUser, { ...user, new_email: email, salt: salt });
  notificationCenter.info(createMessage(ProfileMessage.PROFILE_NEW_EMAIL_ADDED), {
    "data-test-id": "profile-email-change-success",
  });
}

function* resendEmailEffect({ notificationCenter, logger }: TGlobalDependencies): any {
  const user = yield select((s: IAppState) => selectUser(s.auth));
  const salt = yield select(selectLightWalletSalt);
  const email = user.unverifiedEmail;
  if (!email) throw new Error("No unverified email");

  logger.info("Email resent");
  yield call(updateUser, { ...user, new_email: email, salt: salt });
  notificationCenter.info(createMessage(ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENT));
}

export function* addNewEmail(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.profile.addNewEmail>,
): Iterator<any> {
  const email = action.payload.email;

  const isEmailAvailable = yield select((s: IAppState) => selectDoesEmailExist(s.auth));
  const emailModalTitle = isEmailAvailable
    ? createMessage(ProfileMessage.PROFILE_UPDATE_EMAIL_TITLE)
    : createMessage(ProfileMessage.PROFILE_ADD_EMAIL_TITLE);

  const actualVerifiedEmail = yield select((s: IAppState) => selectVerifiedUserEmail(s.auth));
  const actualUnverifiedEmail = yield select((s: IAppState) => selectUnverifiedUserEmail(s.auth));

  if (email === actualVerifiedEmail) {
    notificationCenter.error(createMessage(ProfileMessage.PROFILE_CHANGE_EMAIL_VERIFIED_EXISTS), {
      "data-test-id": "profile-email-change-verified-exists",
    });
    return;
  }

  if (email === actualUnverifiedEmail) {
    notificationCenter.error(createMessage(ProfileMessage.PROFILE_CHANGE_EMAIL_UNVERIFIED_EXISTS), {
      "data-test-id": "profile.email-change-unverified-exists",
    });
    return;
  }

  try {
    yield put(actions.verifyEmail.lockVerifyEmailButton());
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(addNewEmailEffect, email),
      [EJwtPermissions.CHANGE_EMAIL_PERMISSION],
      emailModalTitle,
      createMessage(ProfileMessage.PROFILE_ADD_EMAIL_CONFIRM),
    );
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(createMessage(ProfileMessage.PROFILE_EMAIL_ALREADY_EXISTS), {
        "data-test-id": "profile-email-exists",
      });
    else {
      logger.error("Failed to Add new email", e);
      notificationCenter.error(createMessage(ProfileMessage.PROFILE_ADD_EMAIL_ERROR));
    }
  } finally {
    yield put(actions.verifyEmail.freeVerifyEmailButton());
  }
}

export function* resendEmail({ notificationCenter, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(resendEmailEffect),
      [EJwtPermissions.CHANGE_EMAIL_PERMISSION],
      createMessage(ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_TITLE),
      createMessage(ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_DESCRIPTION),
    );
  } catch (e) {
    logger.error("Failed to resend email", e);
    notificationCenter.error(
      createMessage(ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENDING_FAILED),
    );
  }
}

export function* loadSeedOrReturnToSettings({ logger }: TGlobalDependencies): Iterator<any> {
  // unlock wallet
  try {
    const signEffect = put(actions.web3.fetchWalletPrivateDataFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_TITLE),
      createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION),
    );
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      logger.info("Signing Cancelled");
    } else {
      logger.error("Failed to load seed", error);
    }
    yield put(actions.routing.goToProfile());
  }
}

export function* profileSagas(): any {
  yield fork(neuTakeEvery, actions.profile.addNewEmail.getType(), addNewEmail);
  yield fork(neuTakeEvery, actions.profile.resendEmail.getType(), resendEmail);
  yield fork(
    neuTakeEvery,
    actions.profile.loadSeedOrReturnToProfile.getType(),
    loadSeedOrReturnToSettings,
  );
}
