import { Effect, fork, put, select } from "redux-saga/effects";

import { getMessageTranslation, ToSMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import {IApiUser, IStateUser} from "../auth/interfaces";
import { actions } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { selectCurrentAgreementHash } from "../auth/selectors";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import { AuthMessage } from "../../components/translatedMessages/messages";
import { EInitType } from "../init/interfaces";

/**
 * Handle ToS / agreement
 */
export function* loadCurrentAgreement({
  contractsService,
  logger,
}: TGlobalDependencies): Iterator<any> {
  logger.info("Loading current agreement hash");

  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractsInitialized) {
    yield neuTakeOnly("INIT_DONE", { initType: EInitType.START_CONTRACTS_INIT });
  }

  try {
    const result = yield contractsService.universeContract.currentAgreement();
    let currentAgreementHash = result[2] as string;
    currentAgreementHash = currentAgreementHash.replace("ipfs:", "");
    yield put(actions.tosModal.setCurrentAgreementHash(currentAgreementHash));
  } catch (e) {
    logger.error("Could not load current agreement", e);
  }
}

function* handleAcceptCurrentAgreementEffect({ apiUserService }: TGlobalDependencies): any {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);

  const user: IUser = yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
  yield put(actions.auth.setUser(user));
}

function* handleAcceptCurrentAgreement({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(handleAcceptCurrentAgreementEffect),
      [EJwtPermissions.SIGN_TOS],
      createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TITLE),
      createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TEXT),
    );

    const user: IApiUser = yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
    yield put(actions.auth.setUser(user as IStateUser));
  } catch (e) {
    notificationCenter.error(createMessage(AuthMessage.AUTH_TOC_ACCEPT_ERROR));
    logger.error(new Error("Could not accept Terms and Conditions"), e);
  }
}

function* handleDownloadCurrentAgreement(_: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  const fileName = createMessage(AuthMessage.AUTH_TOC_FILENAME);
  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: currentAgreementHash,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        asPdf: true,
      },
      getMessageTranslation(fileName) as string,
    ),
  );
}

export const termsOfServiceSagas = function*(): Iterator<Effect> {
  yield fork(neuTakeEvery, "AUTH_SET_USER", loadCurrentAgreement);
  yield fork(neuTakeEvery, "ACCEPT_CURRENT_AGREEMENT", handleAcceptCurrentAgreement);
  yield fork(neuTakeEvery, "DOWNLOAD_CURRENT_AGREEMENT", handleDownloadCurrentAgreement);
};
