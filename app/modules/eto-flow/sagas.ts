import { effects } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { convert } from "../../components/eto/utils";
import { EtoDocumentsMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { IApiDetailedBookbuildingStats } from "../bookbuilding-flow/interfaces/DetailedBookbuildingStats";
import { loadEtoContract } from "../public-etos/sagas";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import * as companyEtoDataInterfaces from "./interfaces/CompanyEtoData";
import { EEtoState } from "./interfaces/interfaces";
import * as publicEtoInterfaces from "./interfaces/PublicEtoData";
import { selectIsNewPreEtoStartDateValid, selectIssuerCompany, selectIssuerEto } from "./selectors";
import { bookBuildingStatsToCsvString, createCsvDataUri, downloadFile } from "./utils";

export function* loadIssuerEto({
  apiEtoService,
  notificationCenter,
  logger,
}: TGlobalDependencies): any {
  try {
    const companyResponse: IHttpResponse<
      companyEtoDataInterfaces.IApiCompanyEtoData
    > = yield apiEtoService.getCompany();
    const company = convert(
      companyResponse.body,
      companyEtoDataInterfaces.apiToStateConversionSpec,
    );

    const etoResponse: IHttpResponse<
      publicEtoInterfaces.IApiPublicEtoData
    > = yield apiEtoService.getMyEto();
    const eto = convert(etoResponse.body, publicEtoInterfaces.apiToStateConversionSpec);

    if (eto.state === EEtoState.ON_CHAIN) {
      yield neuCall(loadEtoContract, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));

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
  { notificationCenter, logger }: TGlobalDependencies,
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
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS") return;
  try {
    const detailedStatsResponse: IHttpResponse<
      IApiDetailedBookbuildingStats[]
    > = yield apiEtoService.getDetailedBookBuildingStats();

    const dataAsString: string = yield bookBuildingStatsToCsvString(detailedStatsResponse.body);

    yield downloadFile(createCsvDataUri(dataAsString), "whitelisted_investors.csv");
  } catch (e) {
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS),
    );
    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

function stripEtoDataOptionalFields(
  data: DeepPartial<publicEtoInterfaces.IBlPublicEtoData>,
): DeepPartial<publicEtoInterfaces.IBlPublicEtoData> {
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
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const currentCompanyData: companyEtoDataInterfaces.IBlCompanyEtoData = yield effects.select(
      selectIssuerCompany,
    );
    const currentEtoData: publicEtoInterfaces.IBlPublicEtoData = yield effects.select(
      selectIssuerEto,
    );
    yield apiEtoService.putCompany({
      ...convert(currentCompanyData, companyEtoDataInterfaces.blToApiConversionSpec),
      ...convert(
        action.payload.data.companyData,
        companyEtoDataInterfaces.stateToApiConversionSpec,
      ),
    });
    if (currentEtoData.state === EEtoState.PREVIEW)
      yield apiEtoService.putMyEto(
        convert(
          stripEtoDataOptionalFields({
            //TODO this is already being done on form save. Need to synchronize with convert() method
            ...currentEtoData,
            ...action.payload.data.etoData,
          }),
          publicEtoInterfaces.blToApiConversionSpec,
        ),
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
  { notificationCenter, logger }: TGlobalDependencies,
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

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ISSUER_ETO", loadIssuerEto);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", changeBookBuildingStatus);
  yield fork(neuTakeLatest, "ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS", downloadBookBuildingStats);
  yield fork(neuTakeLatest, "ETO_FLOW_START_DATE_TX", startSetDateTX);
  yield fork(neuTakeLatest, "ETO_FLOW_CLEANUP_START_DATE_TX", cleanupSetDateTX);
}
