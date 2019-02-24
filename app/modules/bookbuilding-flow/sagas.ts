import { fork, put } from "redux-saga/effects";

import { convert } from "../../components/eto/utils";
import { BookbuildingFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { BOOKBUILDING_WATCHER_DELAY, EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { EtoPledgeNotFound } from "../../lib/api/eto/EtoPledgeApi";
import { delay } from "../../utils/delay";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { neuCall, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import {
  DELETE_PLEDGE,
  LOAD_BOOKBUILDING_FLOW_STATS,
  LOAD_PLEDGE,
  SAVE_PLEDGE,
  UNWATCH_BOOKBUILDING_FLOW_STATS,
  WATCH_BOOKBUILDING_FLOW_STATS,
} from "./actions";
import * as bookbuildingStatInterfaces from "./interfaces/BookbuildingStats";
import * as pledgeInterfaces from "./interfaces/Pledge";

export function* saveMyPledgeEffect(
  { apiEtoPledgeService }: TGlobalDependencies,
  etoId: string,
  pledge: pledgeInterfaces.IStatePledge,
): any {
  const pledgeResult: IHttpResponse<
    pledgeInterfaces.IApiPledge
  > = yield apiEtoPledgeService.saveMyPledge(
    etoId,
    convert(pledge, pledgeInterfaces.stateToApiConversionSpec),
  );

  yield put(
    actions.bookBuilding.setPledge(
      etoId,
      convert(pledgeResult.body, pledgeInterfaces.apiToStateConversionSpec),
    ),
  );
  yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
}

export function* saveMyPledge(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== SAVE_PLEDGE) return;

  const { etoId, pledge } = action.payload;

  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(saveMyPledgeEffect, etoId, pledge),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE),
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_DESCRIPTION),
    );
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_SAVE_PLEDGE),
    );
    logger.error(`Failed to save pledge`, e);
  }
}

export function* deleteMyPledgeEffect(
  { apiEtoPledgeService }: TGlobalDependencies,
  etoId: string,
): any {
  yield apiEtoPledgeService.deleteMyPledge(etoId);

  yield put(actions.bookBuilding.setPledge(etoId));
  yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
}

export function* deleteMyPledge(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== DELETE_PLEDGE) return;

  const { etoId } = action.payload;
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(deleteMyPledgeEffect, etoId),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL),
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL_DESCRIPTION),
    );
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_REMOVAL_FAILED),
    );
    logger.error(`Failed to delete pledge`, e);
  }
}

export function* watchBookBuildingStats({ logger }: TGlobalDependencies, action: TAction): any {
  while (true) {
    logger.info("Querying for bookbuilding stats...");
    try {
      yield neuCall(loadBookBuildingStats, { ...action, type: LOAD_BOOKBUILDING_FLOW_STATS });
    } catch (e) {
      logger.error("Error getting bookbuilding stats", e);
    }
    yield delay(BOOKBUILDING_WATCHER_DELAY);
  }
}

export function* loadBookBuildingStats(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== LOAD_BOOKBUILDING_FLOW_STATS) return;

  try {
    const etoId = action.payload.etoId;
    const statsResponse: IHttpResponse<
      bookbuildingStatInterfaces.IApiBookBuildingStats
    > = yield apiEtoService.getBookBuildingStats(etoId);

    yield put(
      actions.bookBuilding.setBookBuildingStats(
        etoId,
        convert(statsResponse.body, bookbuildingStatInterfaces.apiToStateConversionSpec),
      ),
    );
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS),
    );

    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

export function* loadMyPledge(
  { apiEtoPledgeService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== LOAD_PLEDGE) return;

  try {
    const etoId = action.payload.etoId;
    const pledgeResponse: IHttpResponse<
      pledgeInterfaces.IApiPledge
    > = yield apiEtoPledgeService.getMyPledge(etoId);

    yield put(
      actions.bookBuilding.setPledge(
        etoId,
        convert(pledgeResponse.body, pledgeInterfaces.apiToStateConversionSpec),
      ),
    );
  } catch (e) {
    if (!(e instanceof EtoPledgeNotFound)) {
      notificationCenter.error(
        createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE),
      );
      logger.error("Failed to load pledge", e);
    }
  }
}

export function* bookBuildingFlowSagas(): any {
  yield fork(neuTakeEvery, LOAD_BOOKBUILDING_FLOW_STATS, loadBookBuildingStats);
  yield fork(
    neuTakeUntil,
    WATCH_BOOKBUILDING_FLOW_STATS,
    UNWATCH_BOOKBUILDING_FLOW_STATS,
    watchBookBuildingStats,
  );
  yield fork(neuTakeEvery, LOAD_PLEDGE, loadMyPledge);
  yield fork(neuTakeEvery, SAVE_PLEDGE, saveMyPledge);
  yield fork(neuTakeEvery, DELETE_PLEDGE, deleteMyPledge);
}
