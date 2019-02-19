import {effects} from "redux-saga";
import {fork, put, select} from "redux-saga/effects";

import {EtoDocumentsMessage} from "../../components/translatedMessages/messages";
import {createMessage} from "../../components/translatedMessages/utils";
import {EJwtPermissions} from "../../config/constants";
import {TGlobalDependencies} from "../../di/setupBindings";
import {IHttpResponse} from "../../lib/api/client/IHttpClient";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import {IAppState} from "../../store";
import {actions, TAction, TActionFromCreator} from "../actions";
import {ensurePermissionsArePresentAndRunEffect} from "../auth/jwt/sagas";
import {loadEtoContact} from "../public-etos/sagas";
import {neuCall, neuTakeEvery, neuTakeLatest} from "../sagasUtils";
import {selectIsNewPreEtoStartDateValid, selectIssuerCompany, selectIssuerEto} from "./selectors";
import {bookBuildingStatsToCsvString, createCsvDataUri, downloadFile} from "./utils";
import {ETOCommitment} from "../../lib/contracts/ETOCommitment";
import {etoFlowActions} from "./actions";

export function* loadIssuerEto({
  apiEtoService,
  notificationCenter,
  logger,
}: TGlobalDependencies): any {
  try {
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompany();
    const company = companyResponse.body;
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getMyEto();
    const eto = etoResponse.body;

    if (eto.state === EEtoState.ON_CHAIN) {
      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({eto, company}));

    yield put(actions.etoFlow.setIssuerEtoPreviewCode(eto.previewCode));
  } catch (e) {
    logger.error("Failed to load Issuer ETO", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_ACCESS_ETO_FILES_DATA),
    );
    yield put(actions.routing.goToDashboard());
  }
}

function* changeBookBuildingStatusEffect(
  { apiEtoService }: TGlobalDependencies,
  status: boolean,
): Iterator<any> {
  yield apiEtoService.changeBookBuildingState(status);
}

export function* changeBookBuildingStatus(
  {apiEtoService, notificationCenter, logger}: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES") return;
  const { status } = action.payload;
  try {
    const message = action.payload.status
      ? createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_START_BOOKBUILDING)
      : createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_STOP_BOOKBUILDING);
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(changeBookBuildingStatusEffect, status),
      [EJwtPermissions.DO_BOOK_BUILDING],
      message,
    );
  } catch (e) {
    logger.error("Failed to change book-building status", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

export function* downloadBookBuildingStats(
  {apiEtoService, notificationCenter, logger}: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS") return;
  try {
    const detailedStatsResponse: IHttpResponse<any> = yield apiEtoService.getDetailedBookBuildingStats();

    const dataAsString = yield bookBuildingStatsToCsvString(detailedStatsResponse.body);

    yield downloadFile(createCsvDataUri(dataAsString), "whitelisted_investors.csv");
  } catch (e) {
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS),
    );
    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

function stripEtoDataOptionalFields(data: TPartialEtoSpecData): TPartialEtoSpecData {
  // formik will pass empty strings into numeric fields that are optional, see
  // https://github.com/jaredpalmer/formik/pull/827
  // todo: we should probably enumerate Yup schema and clean up all optional numbers
  // todo: we strip these things on form save now, need to move it there -- at
  if (!data.maxTicketEur) {
    return {
      ...data,
      maxTicketEur: undefined,
    };
  }
  return data;
}

export function* saveEtoData(
  {apiEtoService, notificationCenter, logger}: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const currentCompanyData: TCompanyEtoData = yield effects.select(selectIssuerCompany);
    const currentEtoData: TEtoSpecsData = yield effects.select(selectIssuerEto);
    yield apiEtoService.putCompany({
      ...currentCompanyData,
      ...action.payload.data.companyData,
    });
    if (currentEtoData.state === EEtoState.PREVIEW)
      yield apiEtoService.putMyEto(
        stripEtoDataOptionalFields({
          //TODO this is already being done on form save. Need to synchronize with convert() method
          ...currentEtoData,
          ...action.payload.data.etoData,
        }),
      );
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* submitEtoDataEffect({
  apiEtoService,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  yield apiEtoService.submitCompanyAndEto();
  notificationCenter.info(createMessage(EtoDocumentsMessage.ETO_SUBMIT_SUCCESS));
  yield put(actions.etoFlow.loadIssuerEto());
  yield put(actions.routing.goToDashboard());
}

export function* submitEtoData(
  {apiEtoService, notificationCenter, logger}: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_FLOW_SUBMIT_DATA_START") return;
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitEtoDataEffect),
      [EJwtPermissions.SUBMIT_ETO_PERMISSION],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE), //eto.modal.submit-title
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION), //eto.modal.submit-description
    );
  } catch (e) {
    logger.error("Failed to Submit ETO data", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  }
}

function* startSetDateTX(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "ETO_FLOW_START_DATE_TX") return;
  const state: IAppState = yield select();
  if (selectIsNewPreEtoStartDateValid(state)) {
    yield put(actions.txTransactions.startEtoSetDate());
  }
}

export function* cleanupSetDateTX(): any {
  const eto = yield select(selectIssuerEto);
  yield put(actions.publicEtos.loadEto(eto.etoId));
  yield put(actions.etoFlow.clearNewStartDate());
}

export function* loadInvestmentAgreement(
  {contractsService,}: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.etoFlow.loadSignedInvestmentAgreement>,
): any {
  // if (action.type !== etoFlowActions.loadSignedInvestmentAgreement.getType()) return;
  const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(action.payload.etoId)
  const url: string | null = yield  contract.signedInvestmentAgreementUrl
  console.log("loadInvestmentAgreement :","'",url,"'", typeof url)
  yield put(actions.etoFlow.setInvestmentAgreementHash(url !== "" ? url : null))
}



export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ISSUER_ETO", loadIssuerEto);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", changeBookBuildingStatus);
  yield fork(neuTakeLatest, "ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS", downloadBookBuildingStats);
  yield fork(neuTakeLatest, "ETO_FLOW_START_DATE_TX", startSetDateTX);
  yield fork(neuTakeLatest, "ETO_FLOW_CLEANUP_START_DATE_TX", cleanupSetDateTX);
  yield fork(neuTakeLatest, etoFlowActions.loadSignedInvestmentAgreement, loadInvestmentAgreement);
}
